/* eslint-disable no-unused-vars */

import { workspace, ConfigurationTarget, Uri, RelativePattern } from 'vscode';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { has, isNil, difference, hasPath, isEmpty } from 'rambdax';
import anymatch from 'anymatch';
import { OutputChannel } from './OutputChannel';
import { Setting, ConfigMethod, Workspace, InLanguageIds, LanguageIds, Liquidrc, LanguageParticipant } from '../types';
import * as u from '../utils';
import { getSettingsCompletions } from 'data/liquid';
import { $ } from '@liquify/specs';

export class WorkspaceSettings extends OutputChannel {

  /**
   * Formatting Disposals
   *
   * Disposes of the formatHandler and resets it reference
   * to `undefined` only when the handler is defined.
   */
  dispose () {

    // if (this.format.handler) {

    //   this.format.handler.dispose();
    //   this.format.handler = undefined;
    //   this.format.ignored.clear();
    //   this.format.register.clear();

    // } else {

    //   this.format.ignored.clear();
    //   this.format.register.clear();

    // }

  }

  /**
   * Set Default Formatter
   *
   * Sets the in-language `editor.defaultFormatter` to `sissel.shopify-liquid` and
   * replaces any existing entry that might be defined.
   */
  async setDefaultFormatter (languageId: InLanguageIds) {

    if (this.isDefaultFormatter(languageId)) {

      this.info(`The editor.defaultFormatter is already using: ${this.meta.id}`);

      return true;

    }

    const config = workspace.getConfiguration('editor', { languageId });

    try {

      await config.update('defaultFormatter', this.meta.id, this.config.target, true);

      this.info(`Using ${this.meta.id} as the editor.defaultFormatter for ${languageId}`);

      return true;

    } catch (e) {
      this.catch('Failed to set the editor.defaultFormatter', e.message);
    }

  }

  /**
   * Set editor.formatOnSave
   *
   * Set the in~language `editor.formatOnSave` setting. The most relative
   * workspace setting is defined.
   */
  async setFormatOnSave (languageId: InLanguageIds, enable?: boolean) {

    try {

      await workspace
        .getConfiguration('editor', { languageId })
        .update('formatOnSave', enable, this.config.target, true);

    } catch (e) {

      this.catch(`Failed to set the editor.formatOnSave setting for ${languageId}`, e.message);

    }

    this.formatting.enable = enable;

    if (enable) {
      this.status.enable();
      this.info(`Enabled formatOnSave for ${languageId}`);
    } else {
      this.status.disable();
      this.info(`Disable formatOnSave for ${languageId}`);
    }

  }

  /**
   * Is Default Formatter
   *
   * Gets the in-language `editor.defaultFormatter` configuration currently defined in the
   * settings for the given language id. Returns a boolean value indicating whether or not
   * a default formatter is defined.
   */
  isDefaultFormatter (languageId: LanguageIds) {

    const setting = workspace.getConfiguration().inspect(`[${languageId}]`);
    const prop = 'editor.defaultFormatter';

    if (setting.workspaceValue !== undefined && has(prop, setting.workspaceValue)) {

      return setting.workspaceValue[prop] === this.meta.id;

    } else if (setting.globalValue !== undefined && has(prop, setting.globalValue)) {

      return setting.globalValue[prop] === this.meta.id;

    } else if (setting.defaultValue?.[prop] === this.meta.id) {

      return true;

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
      } else {
        this.engine = workspace.getConfiguration('liquid').get('engine');
      }

    } else {

      const settings = workspace.getConfiguration().inspect('liquid');

      if (has('engine', settings.workspaceValue)) {
        this.engine = (settings.workspaceValue as any).engine;
      } else if (has('engine', settings.globalValue)) {
        this.engine = (settings.globalValue as any).engine;
      } else {
        this.engine = (settings.defaultValue as any).engine;
      }

    }

  }

  /**
   * Get External
   *
   * Generates the URI paths defined either via workspace settings on
   * `liquid.file.*` configurations or from the `.liquidrc` file.
   */
  async getExternal (files: string[]) {

    for (const name of files) {

      if (this.files[name] !== null) {

        const { fsPath } = this.files[name];
        const exists = await u.pathExists(fsPath);

        if (exists) {

          try {

            if (name === 'locales') {

              const locales = await u.parseJsonFile(this.files[name]);
              const schema = await u.parseJsonFile(this.files.localesSchema);

              $.liquid.files.set('locales', locales);
              $.liquid.files.set('locales_schema', schema);

            } else if (name === 'settings') {

              const data = await u.parseJsonFile(this.files[name]);

              getSettingsCompletions(fsPath, data);

            }

          } catch (e) {

            this.catch('JSON Error', e);

          }
        } else {

          this.error(`${fsPath}`)(
            'Unable to resolve a file at the path that was provided.',
            `Completion ${name} require you reference a file relative to your root.\n`
          );

        }
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

    const root = this.uri.root.fsPath;
    const settings = workspace.getConfiguration().inspect('liquid');

    /**
     * Globs
     *
     * Adds globals to the completions store
     */
    const globs = async (file: string, array: string[]) => {

      const curr = this.files[file].size;
      const ends = array.length;

      if (curr > 0) this.files[file].clear();

      let added: number = 0;
      let skips: number = 0;

      for (let i = 0; i < ends; i++) {

        const path = array[i];
        const relative = new RelativePattern(root, u.refineURI(path));
        const paths = await workspace.findFiles(relative);

        if (paths.length > 0) {

          for (const entry of paths) {
            if (entry.fsPath.endsWith('.liquid')) {
              this.files[file].add(entry);
              added = added + 1;
            } else {
              skips = skips + 1;
            }
          }

          if (i === ends - 1) {
            if (added > 0 && curr > 0 && curr !== added) {
              const amount = added - curr;

              if (amount > 0) {
                const plural = amount > 1 ? `${amount} files` : `${amount} file`;
                this.info(`${plural} added to the ${file} completion list`);
              } else {
                const abs = Math.abs(amount);
                const plural = abs > 1 ? `${abs} files` : `${abs} file`;
                this.info(`${plural} removed from the ${file} completion list`);
              }
            }

            if (skips > 0 && curr > 0 && curr !== skips) {
              const plural = skips > 1 ? `${skips} files` : `${skips} file`;
              this.info(`${plural} non Liquid files excluded from ${file} completions list`);
            }

            if (curr === 0) {
              const plural = added > 1 ? `${added} files` : `${added} file`;
              this.info(`Using ${file.slice(0, -1)} file completions: ${plural}`);
            }
          }

        } else {
          this.warn(`Unable to resolve any ${file} liquid files at: ${path}`);
        }
      }

      if (this.files[file].size > 0) {
        this.completion.enable[file] = true;
      } else {
        this.completion.enable[file] = false;
      }

      return this.completion.enable[file];

    };

    let rcfile = false;

    if (this.config.method === ConfigMethod.Liquidrc) {

      if (has('files', this.liquidrc)) {
        if (u.isObject(this.liquidrc.files) === false) {

          this.error('Invalid type provided on "files" in .liquidrc')(
            'The "files" setting expects a type object be provided but recieved type',
            `${typeof this.liquidrc.files}. You will need to correct this or`,
            'alternatively you can define files in your workspace file via the',
            '"liquid.files.*" option.'
          );

        } else {
          rcfile = true;
        }
      }
    }

    for (const file of [
      'locales',
      'settings',
      'snippets',
      'sections'
    ]) {

      let defined = false;

      if (rcfile && has(file, this.liquidrc.files)) {
        if (u.isString(this.liquidrc.files[file]) && this.liquidrc.files[file] !== '') {

          this.files[file] = Uri.file(join(root, this.liquidrc.files[file]));

          if (file === 'locales') {
            const name = this.liquidrc.files[file].replace(/\.json$/, '.schema.json');
            const schema = Uri.file(join(root, name));
            if (await u.pathExists(schema.fsPath)) this.files.localesSchema = schema;
          }

          defined = true;

        } else if (u.isArray(this.liquidrc.files[file]) && this.liquidrc.files[file].length > 0) {

          defined = await globs(file, this.liquidrc.files[file]);

        }
      }

      if (defined === false) {

        let value: string | string[];

        if (has(`files.${file}`, settings.workspaceValue)) {
          value = settings.workspaceValue[`files.${file}`];
        } else if (has(`files.${file}`, settings.globalValue)) {
          value = settings.globalValue[`files.${file}`];
        }

        if (u.isString(value)) {
          if (this.liquidrc.files[file].length !== '') {

            this.files[file] = Uri.file(value as string);

            if (file === 'locales') {
              const name = (value as string).replace(/\.json$/, '.schema.json');
              const schema = Uri.file(join(root, name));
              if (u.pathExists(schema.fsPath)) this.files.localesSchema = schema;
            }
          }
        } else if (u.isArray(value) && value.length > 0) {
          await globs(file, value as string[]);
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

    const current = this.formatting.ignoreList;

    if (u.isArray(rules)) {

      for (let i = 0; i < rules.length; i++) {
        const path = join(this.uri.root.fsPath, rules[i]);
        if (!this.formatting.ignoreList.includes(path)) rules[i] = path;
      }

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

      this.formatting.ignoreList = rules;

      if (rules.length === 0) {
        for (const del of difference(current, rules)) this.info('Ignore path removed: ' + del);
        this.formatting.ignoreMatch = null;
      } else {
        this.formatting.ignoreMatch = anymatch(this.formatting.ignoreList);
      }
    }
  }

  /**
   * Get Formatting Status
   *
   * Returns the formatting status.
   */
  isFormattingOnSave (languageId: string = 'liquid'): boolean {

    if (this.isDefaultFormatter(languageId)) {

      const setting = workspace.getConfiguration().inspect(`[${languageId}]`);

      if (setting.workspaceValue !== undefined && has('editor.formatOnSave', setting.workspaceValue)) {

        return setting.workspaceValue['editor.formatOnSave'];

      } else if (setting.globalValue !== undefined && has('editor.formatOnSave', setting.globalValue)) {

        return setting.globalValue['editor.formatOnSave'];

      } else {

        this.warn(`${u.upcase(languageId)} editor.formatOnSave setting is not defined`);

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

    const settings = workspace.getConfiguration().get('liquid.hover');

    if (!u.isObject(settings)) return;

    for (const v of [
      'tags',
      'objects',
      'filters',
      'schema'
    ]) {
      if (has(v, settings) && u.isBoolean(settings[v])) {
        if (v === 'schema' && this.engine !== 'shopify') {
          this.warn('Hovers for {% schema %} only work in the Shopify variation');
        } else {

          if (settings[v] !== this.hovers.enable[v]) {
            if (settings[v]) {
              this.info(`Enabled ${v} hovers`);
            } else {
              this.info(`Disable ${v} hovers`);
            }
          }

          this.hovers.enable[v] = settings[v];

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

    const settings = workspace.getConfiguration().get<Workspace.Validate>('liquid.validate');

    if (has('schema', settings) && u.isBoolean(settings.schema)) {
      if (this.engine !== 'shopify') {
        this.warn('Validations for {% schema %} only work when the Liquid "engine" is Shopify');
      } else {

        if (settings.schema !== this.json.config.validate) {
          if (settings.schema) {
            this.info('Enabled {% schema %} validations');
          } else {
            this.info('Disable {% schema %} validations');
          }
        }

        this.json.config.validate = settings.schema;
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

    const settings = workspace.getConfiguration().get<Workspace.Validate>('liquid.completion');

    if (u.isObject(settings)) {

      for (const v of [
        'tags',
        'filters',
        'logical',
        'objects',
        'section',
        'schema'
      ]) {

        if (has(v, settings) && u.isBoolean(settings[v])) {

          if (v === 'section' || v === 'objects' || v === 'schema') {
            if (this.engine !== 'shopify' && settings[v] === true) {
              this.warn(`Completion for ${v} will not work in Liquid ${u.upcase(this.engine)}`);
            }
          } else {

            if (settings[v] !== this.completion.enable[v]) {
              if (settings[v]) {
                this.info(`Enabled ${settings[v]} completions`);
              } else {
                this.info(`Disable ${settings[v]} completions`);
              }
            }

            this.completion.enable[v] = settings[v];

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

        this.formatting.rules = u.rulesNormalize(this.liquidrc.format);

        if (has('ignore', this.liquidrc.format) && u.isArray(this.liquidrc.format.ignore)) {
          this.getIgnores(this.liquidrc.format.ignore);
        } else if (this.formatting.ignoreList.length > 0) {
          this.getIgnores([]);
        }
      }

    } else {

      const settings = workspace.getConfiguration('liquid');

      if (settings.has('format.rules')) {
        const rules = settings.get<Workspace.Format['rules']>('format.rules');
        if (u.isObject(rules)) {
          this.formatting.rules = rules;
        }
      }

      if (settings.has('format.ignore')) {

        const ignore = settings.get<Workspace.Format['ignore']>('format.ignore');

        if (u.isArray(ignore)) {
          this.getIgnores(ignore);
        } else if (this.formatting.ignoreList.length > 0) {
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

    const config = workspace.getConfiguration().inspect('liquid');

    for (const v of [ 'workspaceValue', 'globalValue' ]) {

      if (has('config.baseUrl', config[v])) {
        if (u.isString(config[v]['config.baseUrl'])) {

          if (config[v]['config.baseUrl'][0] === '.' && config[v]['config.baseUrl'][0] === '.') {

            this.error('Invalid "liquid.config.baseUrl" path')(
              'The "liquid.config.baseUrl" option only accepts paths relative to your',
              'projects root directory. Reverse paths are not support at:\n',
              `Provided: ${config[v]['config.baseUrl']}`,
              `Settings: ${v === 'workspaceValue' ? '.vscode/settings.json' : 'Global Workspace Settings'}`
            );

            break;

          }

          const base = join(this.uri.root.fsPath, config.workspaceValue['config.baseUrl']);

          if (base !== this.uri.root.fsPath && existsSync(base)) {
            this.uri.root = Uri.file(base);
            this.info(`Using "config.baseUrl" sub-path mapping: ${base}`);
          }
        } else {

          this.error('Invalid type provided for "liquid.config.baseUrl" setting')(
            'The "liquid.config.baseUrl" option only accepts string type values',
            `You provided ${typeof config[v]['config.baseUrl']} which is invalid`
          );

        }
      }
    }

    if (this.uri.base === null) this.uri.base = this.uri.root;

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
  async getLiquidrc () {

    if (isNil(this.uri.liquidrc)) {

      const path = u.hasLiquidrc(this.uri.base.fsPath);

      if (!path) {

        this.hasLiquidrc = false;
        this.config.method = this.config.target === ConfigurationTarget.Workspace
          ? ConfigMethod.Workspace
          : ConfigMethod.Undefined;

        return Setting.LiquidrcUndefined;

      }

      this.uri.liquidrc = Uri.file(path);
      this.config.method = ConfigMethod.Liquidrc;

    } else {

      const exists = await u.pathExists(this.uri.liquidrc.fsPath);

      if (!exists) {

        this.hasLiquidrc = false;
        this.uri.liquidrc = null;
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

        return Setting.LiquidrcInvalidRules;

      }

      if (this.isReady === false) {

        this.deprecation.liquidrc = u.hasDeprecatedSettings(this.liquidrc);

        if (this.deprecation.liquidrc === '4.0.0') {

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

          this.info('Updated the .liquidrc file, you are now using the v4.0.0 structure');

          this.liquidrc = update;
          this.deprecation.liquidrc = null;

        }

      }

      if (this.deprecation.liquidrc === null) {

        await this.getFiles();

        this.getFormatRules();
        this.getEngine();

        await this.getExternal([ 'locales', 'settings' ]);

      }

      return Setting.LiquidrcDefined;

    } catch (e) {

      this.catch('The .liquidrc configuration file could not be parsed', e);

    }

    return Setting.LiquidrcError;

  };

  /**
   * Get Deprecations
   *
   * Detects configuration deprecatisons
   */
  async getDeprecations () {

    const config = u.hasDeprecatedSettings();

    if (isNil(this.uri.liquidrc)) {

      const path = u.hasLiquidrc(this.uri.root.fsPath);

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
    const settings = workspace.getConfiguration('liquid');
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
          this.info('Deprecated: liquid.format.enable is no longer supported and was removed from your settings');
        }

        await settings.update(`format.${prop}`, undefined, ConfigurationTarget.Global);

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
          this.info('Deprecated: liquid.format.enable is no longer supported and was removed from your settings');
        }

        await settings.update(`format.${prop}`, undefined, ConfigurationTarget.Workspace);

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
        await settings.update('format.rules', update, this.config.target);
      }

    } else if (this.config.method === ConfigMethod.Liquidrc) {

      if (has('engine', this.liquidrc)) {
        if (engine.workspaceValue) {
          await settings.update('engine', undefined, ConfigurationTarget.Workspace);
        } else if (engine.globalValue) {
          await settings.update('engine', undefined, ConfigurationTarget.Global);
        }
      }

      if (hasPath('format.ignore', this.liquidrc)) {
        await settings.update('format.ignore', undefined, this.config.target);
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
  async getSettings () {

    const exists = await u.pathExists(this.uri.workspace.fsPath);

    if (exists) {
      this.info(`Using workspace file: ${this.uri.workspace.path}`);
      this.config.target = ConfigurationTarget.Workspace;
      this.config.inspect = 'workspaceValue';
    } else {
      this.config.target = ConfigurationTarget.Global;
      this.config.inspect = 'globalValue';
    }

    this.getBaseUrl();

    await this.getLiquidrc();

    // if (this.isReady === false) {
    //   this.deprecation.workspace = u.hasDeprecatedSettings();
    //   if (this.deprecation.workspace === '4.0.0') {
    //     const updated = await this.fixWorkspace();
    //     if (updated) {
    //       this.info('Updated to the latest v4.0.0 workspace settings structure');
    //     }
    //   }
    // }

    if (this.config.method === ConfigMethod.Workspace) {

      await this.getFiles();
      this.getFormatRules();
      this.getEngine();
    }

    this.getCompletions();
    this.getValidations();
    this.getHovers();

    await this.getExternal([ 'locales', 'settings' ]);
  };

}
