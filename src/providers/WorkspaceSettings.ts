/* eslint-disable no-unused-vars */

import { workspace, ConfigurationTarget, Uri } from 'vscode';
import { existsSync } from 'node:fs';
import { has, isNil, difference, mapAsync, flatten, hasPath, isEmpty } from 'rambdax';
import anymatch from 'anymatch';
import { OutputChannel } from 'providers/OutputChannel';
import { Setting, ConfigMethod, Workspace, InLanguageIds, LanguageIds, Liquidrc } from 'types';
import * as u from 'utils';

export class WorkspaceSettings extends OutputChannel {

  /**
   * Returns workspace configuration for `liquid.*`
   */
  get getConfig () {

    return workspace.getConfiguration('liquid');

  }

  /**
   * Formatting Disposals
   *
   * Disposes of the formatHandler and resets it reference
   * to `undefined` only when the handler is defined.
   */
  dispose () {

    if (this.format.handler) {

      this.format.handler.dispose();
      this.format.handler = undefined;
      this.format.ignored.clear();
      this.format.register.clear();

    } else {

      this.format.ignored.clear();
      this.format.register.clear();

    }

  }

  /**
   * Set Default Formatter
   *
   * Sets the in-language `editor.defaultFormatter` to use `sissel.shopify-liquid`
   */
  async setDefaultFormatter (languageId: InLanguageIds) {

    if (this.isDefaultFormatter(languageId)) {
      this.info(`Default formatter is already defined to use ${this.meta.id}`);
      return true;
    }

    const config = workspace.getConfiguration('editor', { languageId });
    await config.update('defaultFormatter', this.meta.id, this.config.target, true);

    this.info(`Default formatter for ${languageId} was set to "${this.meta.id}"`);

    return true;

  }

  /**
   * Engine Defintion
   *
   * Assigns and returns the known Liquid engine being used.
   */
  async setFormatOnSave (languageId: InLanguageIds, enable?: boolean) {

    await workspace
      .getConfiguration('editor', { languageId })
      .update('formatOnSave', enable, this.config.target, true);

    this.canFormat = enable;

    if (enable) {
      this.status.enable();
      this.info(`Enabled formatOnSave for ${languageId}`);
    } else {
      this.status.disable();
      this.info(`Disabled formatOnSave for ${languageId}`);
    }

  }

  /**
   * Get Default Formatter
   *
   * Gets the in-language `editor.defaultFormatter` configuration
   * currently defined in the settings for the given language id.
   * Returns a boolean value indicating whether or not a default formatter
   * is defined.
   */
  isDefaultFormatter (languageId: LanguageIds) {

    const setting = workspace.getConfiguration().inspect(languageId);

    if (setting.workspaceLanguageValue !== undefined) {
      this.info(`Using workspace settings: ${this.uri.workspace}`);
      if (has('editor.defaultFormatter', setting.workspaceLanguageValue)) {
        return setting.workspaceLanguageValue['editor.defaultFormatter'] === this.meta.id;
      }
    } else if (setting.globalLanguageValue !== undefined) {
      if (has('editor.defaultFormatter', setting.globalLanguageValue)) {
        return setting.globalLanguageValue['editor.defaultFormatter'] === this.meta.id;
      }
    }

    return false;

  }

  /**
   * Engine Defintion
   *
   * Assigns and returns the known Liquid engine being used.
   */
  getEngine () {

    if (this.config.method === ConfigMethod.Liquidrc) {
      if (has('engine', this.liquidrc) && u.isString(this.liquidrc.engine)) {
        this.engine = this.liquidrc.engine;
      }
    } else {
      if (this.getConfig.has('engine')) {
        this.engine = this.getConfig.get('engine');
      } else {
        this.engine = 'shopify';
      }
    }

  }

  /**
   * Get Files
   *
   * Generates the URI paths defined either via workspace settings on
   * `liquid.file.*` configurations or from the `.liquidrc` file.
   */
  async getFiles (): Promise<void> {

    const files = Object.keys(this.uri.files); // returns the name of each file

    let rcfile = false;

    if (this.config.method === ConfigMethod.Liquidrc) {

      if (has('files', this.liquidrc)) {
        if (u.isObject(this.liquidrc.files) === false) {

          this.error('Invalid type provided on "files" in .liquidrc')(
            'The "files" setting expect a type object but recieved type',
            `${typeof this.liquidrc.files} You need to use the correct type of`,
            'alternatively you can define files in your workspace file via the',
            '"liquid.files.*" option.'
          );

        } else {
          rcfile = true;
        }
      }
    } else {
      if (this.getConfig.has('files') === false) return null;
    }

    for (const file of files) {

      let defined = false;

      if (rcfile) {
        if (has(file, this.liquidrc.files)) {

          if (u.isString(this.liquidrc.files[file])) {
            this.uri.files[file] = Uri.file(this.liquidrc.files[file]);
            defined = true;
          } else if (u.isArray(this.liquidrc.files[file])) {

            const paths = await mapAsync<string, Uri[]>(async (glob) => {
              return workspace.findFiles(glob);
            }, this.liquidrc.files[file]);

            this.uri.files[file] = flatten<Uri>(paths);
            defined = true;
          }
        }
      }

      if (defined === false && this.getConfig.has(`files.${file}`)) {

        const source = this.getConfig.get<string | string[]>(`files.${file}`);

        if (u.isString(source)) {
          this.uri.files[file] = Uri.file(source as string);
        } else if (u.isArray(source)) {

          const paths = await mapAsync<string, Uri[]>(async (glob) => {
            return workspace.findFiles(glob);
          }, source as string[]);

          this.uri.files[file] = flatten<Uri>(paths);

        }

      }
    }
  }

  /**
   * Get Ignores
   *
   * Retrives the ignored files from the `liquid.format.ignore` or `ignore`
   * property values. When configuration is updated the `ignore` state
   * reference is updated and output is sent informing upon changes.
   */
  getIgnores (rules: string[]) {

    const current = this.format.ignoreList;

    if (u.isArray(rules)) {

      if (this.isReady && rules.length > 0) {

        if (current.length > 0) {
          for (const remove of difference(current, rules)) {
            this.info('Ignore path removed: ' + remove);
          }
        }

        for (const added of difference(rules, current)) {
          this.info('Ignore path created: ' + added);
        }

      }

      this.format.ignoreList = rules;

      if (rules.length === 0) {

        for (const remove of difference(current, rules)) {
          this.info('Ignore path removed: ' + remove);
        }

        this.format.ignoreMatch = null;

      } else {

        this.format.ignoreMatch = anymatch(this.format.ignoreList);

      }

    }
  }

  /**
   * Get Languages
   *
   * Augments the `languages` object and aligns language values
   * using `sissel.shopify-liquid` in~language `editor.defaultFormatter`.
   */
  getLanguages () {

    for (const id in this.languages) {
      if (this.isDefaultFormatter(id) && this.languages[id] === false) {
        this.languages[id] = true;
        this.selector.active.push({ language: id, scheme: 'file' });
        this.info('The vscode-liquid extension is the default formatter for ' + id);
      }
    }

  };

  /**
   * Get Formatting Status
   *
   * Returns the formatting status.
   */
  isFormattingOnSave (languageId: string) {

    if (this.isDefaultFormatter(languageId)) {

      const setting = workspace.getConfiguration().inspect(languageId);

      if (setting.workspaceLanguageValue !== undefined) {
        if (has('editor.defaultFormatter', setting.workspaceLanguageValue)) {
          return setting.workspaceLanguageValue['editor.defaultFormatter'];
        }
      } else if (setting.globalLanguageValue !== undefined) {
        if (has('editor.defaultFormatter', setting.globalLanguageValue)) {
          return setting.globalLanguageValue['editor.defaultFormatter'];
        }
      } else {
        this.warn(`The ${languageId} "editor.formatOnSave" setting is not defined`);
      }

    }

    return false;

  }

  /**
   * Get Hover Status
   *
   * Applied the hover control settings
   */
  getHovers () {

    if (this.getConfig.has('hover') === false) return;

    const hovers = this.getConfig.get<Workspace.Hover>('hover');

    if (u.isObject(hovers)) {

      if (has('tags', hovers)) {
        this.canHover.tags = hovers.tags;
        if (hovers.tags) {
          this.info('Hovers are enabled for: tags');
        } else {
          this.info('Hovers are disabled for: tags');
        }
      }

      if (has('filters', hovers)) {
        this.canHover.filters = hovers.filters;
        if (hovers.filters) {
          this.info('Hovers are enabled for: filters');
        } else {
          this.info('Hovers are disabled for: filters');
        }
      }

      if (has('schema', hovers)) {
        if (this.engine === 'shopify') {
          this.canComplete.schema = hovers.schema;
          if (hovers.schema) {
            this.info('Hovers are enabled for: {% schema %}');
          } else {
            this.info('Hovers are disabled for: {% schema %}');
          }
        } else {
          if (hovers.schema) {
            this.warn('Hovers for {% schema %} will not work in Liquid Standard');
          }
        }
      }

    }

  }

  /**
   * Get Validations
   *
   * Applied validation control settings
   */
  getValidations () {

    if (this.getConfig.has('validate') === false) return;

    const validate = this.getConfig.get<Workspace.Validate>('validate');

    if (u.isObject(validate)) {
      if (has('schema', validate)) {
        if (this.engine === 'shopify') {
          this.canValidate.schema = validate.schema;
          if (validate.schema) {
            this.info('Validations are enabled for: {% schema %}');
          } else {
            this.info('Validations are disabled for: {% schema %}');
          }
        } else {
          if (validate.schema) {
            this.warn('Validations for {% schema %} only work when the Liquid "engine" is Shopify');
          }
        }
      }
    }

  }

  /**
   * Get Completions
   *
   * Applied configuration status of completions.
   *
   */
  getCompletions () {

    if (this.getConfig.has('completion') === false) return;

    const completions = this.getConfig.get<Workspace.Completion>('completion');

    if (u.isObject(completions)) {

      if (has('tags', completions)) {
        this.canComplete.tags = completions.tags;
        if (completions.tags) {
          this.info('Completions are enabled for: tags');
        } else {
          this.info('Completions are disabled for: tags');
        }
      }

      if (has('filters', completions)) {
        this.canComplete.filters = completions.filters;
        if (completions.filters) {
          this.info('Completions are enabled for: filters');
        } else {
          this.info('Completions are disabled for: filters');
        }
      }

      if (has('logical', completions)) {
        this.canComplete.logical = completions.logical;
        if (completions.logical) {
          this.info('Completions are enabled for: logicals');
        } else {
          this.info('Completions are disabled for: logicals');
        }
      }

      if (has('objects', completions)) {
        if (this.engine === 'shopify') {
          this.canComplete.objects = completions.objects;
          if (completions.objects) {
            this.info('Completions are enabled for: objects');
          } else {
            this.info('Completions are disabled for: objects');
          }
        } else {
          if (completions.objects) {
            this.warn('Completion for objects will not work in Liquid Standard');
          }
        }
      }

      if (has('section', completions)) {
        if (this.engine === 'shopify') {
          this.canComplete.section = completions.section;
          if (completions.section) {
            this.info('Completions are enabled for: sections');
          } else {
            this.info('Completions are disabled for: sections');
          }
        } else {
          if (completions.section) {
            this.warn('Completion for sections will not work in Liquid Standard');
          }
        }
      }

      if (has('schema', completions)) {
        if (this.engine === 'shopify') {
          this.canComplete.schema = completions.schema;
          if (completions.schema) {
            this.info('Completions are enabled for: {% schema %}');
          } else {
            this.info('Completions are disabled for: {% schema %}');
          }
        }
      }

    }

  }

  /**
   * Get Format Rules
   */
  getFormatRules () {

    if (this.config.method === ConfigMethod.Liquidrc) {
      if (has('format', this.liquidrc)) {

        this.format.rules = u.rulesNormalize(this.liquidrc.format);

        if (has('ignore', this.liquidrc.format) && u.isArray(this.liquidrc.format.ignore)) {
          this.getIgnores(this.liquidrc.format.ignore);
        } else if (this.format.ignoreList.length > 0) {
          this.getIgnores([]);
        }

      }
    } else {

      if (this.getConfig.has('format.rules')) {
        const rules = this.getConfig.get('format.rules');
        if (u.isObject(rules)) this.format.rules = rules;
      }

      if (this.getConfig.has('format.ignore')) {

        const ignore = this.getConfig.get<Workspace.Format['ignore']>('format.ignore');

        if (has('ignore', ignore) && u.isArray(ignore)) {

          this.getIgnores(ignore);

        } else if (this.format.ignoreList.length > 0) {

          this.getIgnores([]);

        }

      }

    }
  }

  /**
   * Get BaseURL
   *
   * Applied baseURL
   */
  getBaseUrl () {

    if (this.getConfig.has('config.baseUrl')) {

      const baseUrl = this.getConfig.get<string>('config.baseUrl');

      if (u.isString(baseUrl)) {

        const newRoot = Uri.joinPath(this.uri.root, baseUrl);

        if (newRoot.fsPath !== this.uri.root.fsPath && existsSync(newRoot.fsPath)) {
          this.uri.root = newRoot;
        }
      }
    }

  }

  /**
   * Get Liquidrc
   *
   * Checks for the existence of a `.liquirc` file and parses it.
   * Determines the _type_ of file and reasons with it accordingly.
   * When a `liquidrc` file is detected then it will run precedence over
   * all over configuration options.
   *
   * Returns a number based value which indicated what occured in the parse:
   */
  async getLiquidrc (options: { fixDeprecated: boolean } = { fixDeprecated: false }) {

    if (isNil(this.uri.liquidrc)) {

      const path = await u.hasLiquidrc(this.uri.root.fsPath);
      if (!path) {
        this.config.method = ConfigMethod.Workspace;
        return Setting.LiquidrcUndefined;
      }

      this.uri.liquidrc = Uri.file(path);
      this.config.method = ConfigMethod.Liquidrc;

    } else {
      const exists = await u.pathExists(this.uri.liquidrc.fsPath);
      if (!exists) {
        this.config.method = ConfigMethod.Workspace;
        return Setting.LiquidrcUndefined;
      }
    }

    try {

      const read = await workspace.fs.readFile(this.uri.liquidrc);

      this.liquidrc = u.jsonc(read.toString());

      if (!u.isObject(this.liquidrc)) {

        this.error('Invalid configuration type provided in .liquidrc')(
          'The .liquirc file expects an {} (object) type to be provided but',
          `instead recieved an ${typeof this.liquidrc} type which is invalid.`,
          'You can generate a .liquidrc file via the command palette (CMD+SHIFT+P)'
        );

        this.liquidrc = null;
        this.config.method = ConfigMethod.Workspace;

        return Setting.LiquidrcInvalidRules;
      }

      if (options.fixDeprecated === true) {

        this.deprecation.liquidrc = u.hasDeprecatedSettings(this.liquidrc);

        if (this.deprecation.liquidrc === '3.4.0') {

          this.info('Updating your .liquidrc file to the latest structure');

          const update: Liquidrc = {
            engine: this.engine,
            files: {
              locales: '',
              settings: '',
              sections: [],
              snippets: []
            },
            format: <Liquidrc['format']>{
              ignore: has('ignore', this.liquidrc) ? (this.liquidrc as any).ignore : [],
              ...u.updateRules(this.liquidrc)
            }
          };

          await workspace.fs.writeFile(this.uri.liquidrc, new Uint8Array(
            Buffer.from(JSON.stringify(update, null, 2))
          ));

          this.liquidrc = update;
          this.info('Updated the .liquidrc file, you are now using the v3.4.0 structure');
          this.deprecation.liquidrc = null;
        }

      }

      if (this.deprecation.liquidrc === null) {

        await this.getFiles();
        this.getFormatRules();
        this.getEngine();

      }

      return Setting.LiquidrcDefined;

    } catch (e) {

      this.catch('The .liquidrc configuration file could not be parsed', e);

    }

    this.config.method = ConfigMethod.Workspace;

    return Setting.LiquidrcError;

  };

  /**
   * Get Runtime
   *
   * Invoked upon extension activation and quickly reason about with the
   * required configuration settings to determine what action should take
   * place in regards to which configuration method to use.
   */
  getConfigMethod () {

    if (this.getConfig.has('config.method')) {

      this.config.method = this.getConfig.get('config.method') === 'liquidrc'
        ? ConfigMethod.Liquidrc
        : ConfigMethod.Workspace;
    }

  }

  /**
   * Get Deprecations
   *
   * Detects configuration deprecatisons
   */
  async getDeprecations () {

    const config = u.hasDeprecatedSettings();

    if (isNil(this.uri.liquidrc)) {

      const path = await u.hasLiquidrc(this.uri.root.fsPath);

      if (!path) return { config, rcfile: null };

      const liquidrc = Uri.file(path);
      const read = await workspace.fs.readFile(liquidrc);

      try {

        const file = u.jsonc(read.toString());
        const rcfile = u.hasDeprecatedSettings(file);

        return { config, rcfile };

      } catch (e) {

        this.catch('The .liquidrc configuration file could not be parsed', e);

      }

    }

  }

  async fixWorkspace () {

    const current = workspace.getConfiguration().inspect('liquid.format');
    const engine = workspace.getConfiguration().inspect('liquid.engine');
    const format = u.updateRules(current);
    const update: any = {};

    for (const prop of [
      'enable',
      'wrap',
      'crlf',
      'preserveLine',
      'preserveComment',
      'indentChar',
      'indentSize',
      'endNewline',
      'endNewLine',
      'commentIndent',
      'liquid',
      'markup',
      'json',
      'style',
      'script'
    ]) {

      if (has(prop, current.globalValue) && current.globalValue[prop] !== null) {

        if (prop === 'enable') {
          this.info('The "liquid.format.enable" option is now deprecated and has been removed for your config');
        }

        await this.getConfig.update(`format.${prop}`, undefined, ConfigurationTarget.Global);

        if (prop === 'markup') {
          update.liquid = format.liquid;
          update.markup = format.markup;
        } else if (prop === 'json') {
          update.json = format.json;
        } else if (prop === 'style') {
          update.style = format.style;
        } else if (prop === 'script') {
          update.script = format.script;
        } else if (has(prop, format)) {
          update[prop] = format[prop];
        }

      } else if (has(prop, current.workspaceValue) && current.workspaceValue[prop] !== null) {

        if (prop === 'enable') {
          this.info('The "liquid.format.enable" option is now deprecated and has been removed for your config');
        }

        await this.getConfig.update(`format.${prop}`, undefined, ConfigurationTarget.Workspace);

        if (prop === 'markup') {
          update.liquid = format.liquid;
          update.markup = format.markup;
        } else if (prop === 'json') {
          update.json = format.json;
        } else if (prop === 'style') {
          update.style = format.style;
        } else if (prop === 'script') {
          update.script = format.script;
        } else if (has(prop, format)) {
          update[prop] = format[prop];
        }

      }
    }

    if (this.config.method === ConfigMethod.Workspace) {

      if (!isEmpty(update)) {
        await this.getConfig.update('format.rules', update, this.config.target);
      }

    } else if (this.config.method === ConfigMethod.Liquidrc) {

      if (has('engine', this.liquidrc)) {
        if (engine.workspaceValue) {
          await this.getConfig.update('engine', undefined, ConfigurationTarget.Workspace);
        } else if (engine.globalValue) {
          await this.getConfig.update('engine', undefined, ConfigurationTarget.Global);
        }
      }

      if (hasPath('format.ignore', this.liquidrc)) {
        await this.getConfig.update('format.ignore', undefined, this.config.target);
      }

    }

    return true;

  }

  /**
   * Get Workspace
   *
   * Walks over the editor settings and determines the configuration defined.
   * Returns an enum that informs upon state of the editors options
   */
  async getWorkspace (options: { fixDeprecated: boolean } = { fixDeprecated: false }) {

    const exists = await u.pathExists(this.uri.workspace.fsPath);

    this.config.target = exists
      ? ConfigurationTarget.Workspace
      : ConfigurationTarget.Global;

    this.getBaseUrl();
    this.getConfigMethod();

    await this.getLiquidrc(options);

    if (options.fixDeprecated === true) {

      this.deprecation.workspace = u.hasDeprecatedSettings();

      if (this.deprecation.workspace === '3.4.0') {

        const updated = await this.fixWorkspace();

        if (updated) this.info('Updated workspace settings to the latest v3.4.0 settings structure');

        this.deprecation.workspace = null;

      }

    }

    if (this.config.method === ConfigMethod.Workspace) {
      await this.getFiles();
      this.getFormatRules();
      this.getEngine();
    }

    this.getCompletions();
    this.getValidations();
    this.getHovers();

  };

}
