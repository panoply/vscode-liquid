/* eslint-disable no-unused-vars */
import {
  Setting,
  ConfigMethod,
  Workspace,
  InLanguageIds,
  LanguageIds,
  Liquidrc,
  SharedSchema,
  FileKeys,
  SettingsSchema
} from '../types';
import { workspace, ConfigurationTarget, Uri, RelativePattern } from 'vscode';
import { existsSync } from 'node:fs';
import { join, basename, relative } from 'node:path';
import { has, isNil, difference, hasPath, isEmpty, equals, T } from 'rambdax';
import anymatch from 'anymatch';
import { OutputChannel } from './OutputChannel';
import * as u from '../utils';
import { getSettingsCompletions } from 'data/liquid';
import { $ } from '@liquify/specs';

export class WorkspaceSettings extends OutputChannel {

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

      this.info(`${this.meta.id} is the editor.defaultFormatter for ${languageId}`);

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
  public isDefaultFormatter (languageId: LanguageIds) {

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
  public getEngine () {

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
   * Get Shared Schema
   *
   * Function method for maintaining active shared schema Shopify references
   */
  async getSharedSchema (uri?: Uri, { remove = false, rename = false } = {}) {

    if (u.isUndefined(uri)) {

      const paths = await workspace.findFiles('**/*.schema', '**/node_modules/**');

      for (const schema of paths) {
        if (!this.files.sharedSchema.has(schema.fsPath)) {

          const data = await u.parseJsonFile<SharedSchema>(schema);
          const base = basename(schema.fsPath);
          const file = base.slice(0, base.lastIndexOf('.'));

          if (data) {

            this.files.sharedSchema.add(schema.fsPath);
            this.json.extend(schema, data);
            this.info(`syncify shared~schema file: ${base}`);

            $.liquid.files.set(file, data);

          } else {

            if (this.hasActivated) {
              this.warn(`Invalid or Empty shared schema at: /${relative(this.uri.root.fsPath, schema.fsPath)}`);
            }
          }
        }
      }

    } else if (uri) {

      const base = basename(uri.fsPath);
      const file = base.slice(0, base.lastIndexOf('.'));

      if (remove === true || rename === true) {

        if (this.files.sharedSchema.has(uri.fsPath)) {

          $.liquid.files.delete(file);

          this.files.sharedSchema.delete(uri.fsPath);
          this.json.extend(uri, null);

          if (remove) {
            this.info(`removed shared~schema file: ${base}`);
          }
        }

      } else {

        const data = await u.parseJsonFile<SharedSchema>(uri);

        if (data && isEmpty(data) === false) {

          if (!this.files.sharedSchema.has(uri.fsPath)) {

            this.info(`syncify shared~schema file: ${base}`);
            this.files.sharedSchema.add(uri.fsPath);
            this.json.extend(uri, data);

            $.liquid.files.set(file, data);

          } else {

            const current = $.liquid.files.get(file);

            for (const $ref in current) {
              if ($ref in data) {
                if (!equals(data[$ref], current[$ref])) {
                  this.info(`updated "${$ref}" in shared~schema file: ${base}`);
                }
              } else {
                this.info(`deleted "${$ref}" in shared~schema file: ${base}`);
              }
            }

            for (const $ref in data) {
              if (!($ref in current)) {
                this.info(`created "${$ref}" in shared~schema file: ${base}`);
              }
            }

            $.liquid.files.set(file, data);
            this.json.extend(uri, data);

          }

        } else {

          if (this.files.sharedSchema.has(uri.fsPath)) {

            $.liquid.files.delete(file);

            this.files.sharedSchema.delete(uri.fsPath);
            this.json.extend(uri, null);
            this.info(`removed shared~schema file: ${base}`);

          }

        }

      }

    }

    this.json.configure();

  }

  /**
   * Get File Completions
   *
   * Function method for obtaining and maintaining import files such as snippets
   */
  async getFileCompletions (types: FileKeys[]) {

    const type = types.shift();

    if (this.config.sources.files[type] === ConfigMethod.Undefined) {
      if (types.length !== 0) return this.getFileCompletions(types);
      return null;
    }

    const source = this.config.sources.files[type];

    let config: 'workspace' | '.liquidrc';
    let input: string[];
    let added: number = 0;
    let skips: number = 0;
    let size: number = 0;

    if (source === ConfigMethod.Workspace) {
      config = 'workspace';
      input = workspace.getConfiguration().get<string[]>(`liquid.files.${this.engine}.${type}`);
    } else {
      config = '.liquidrc';
      input = this.liquidrc.files[type];
    }

    if (this.files[type].size > 0) {
      if (type === 'sections') {
        size = this.files.sections.size + this.files.sectionGroups.size;
        this.files[type].clear();
        this.files.sectionGroups.clear();
      } else {
        size = this.files[type].size;
        this.files[type].clear();
      }
    }

    for (let i = 0; i < input.length; i++) {

      const path = input[i];
      const relative = new RelativePattern(this.uri.root, u.refineURI(path));
      const paths = await workspace.findFiles(relative);

      if (paths.length > 0) {

        for (const entry of paths) {

          if (entry.fsPath.endsWith('.liquid')) {

            if (type === 'sections') {
              if (entry.fsPath.endsWith('-group.liquid')) {
                this.files.sectionGroups.add(entry);
              } else {
                this.files.sections.add(entry);
              }
            } else {
              this.files[type].add(entry);
            }

            added = added + 1;
          } else {
            skips = skips + 1;
          }
        }

        if (i === input.length - 1) {

          if (added > 0 && size > 0 && size !== added) {

            const amount = added - size;

            if (amount > 0) {
              const plural = amount > 1 ? `${amount} files` : `${amount} file`;
              this.info(`${plural} added to the ${type} completion list`);
            } else {
              const abs = Math.abs(amount);
              const plural = abs > 1 ? `${abs} files` : `${abs} file`;
              this.info(`${plural} removed from the ${type} completion list`);
            }
          }

          if (skips > 0 && size > 0 && size !== skips) {
            const plural = skips > 1 ? `${skips} files` : `${skips} file`;
            this.info(`${plural} non Liquid files excluded from ${type} completions list`);
          }

          if (size === 0) {
            const plural = added > 1 ? `${added} files` : `${added} file`;
            this.info(`${config} ${type} file completions: ${plural}`);
          }
        }

      } else {

        this.warn(`Unable to resolve any ${type} liquid files at: ${path}`);

      }
    }

    if (types.length !== 0) return this.getFileCompletions(types);

  }

  /**
   * Set Locale File
   *
   * Function method for setting Shopify Locales completions
   */
  async setLocaleFile () {

    if (this.config.sources.files.locales === ConfigMethod.Undefined) return null;

    let config: 'workspace' | '.liquidrc';
    let input: string;

    if (this.config.sources.files.locales === ConfigMethod.Workspace) {
      config = 'workspace';
      input = workspace.getConfiguration().get<string>('liquid.files.shopify.locales');
    } else {
      config = '.liquidrc';
      input = (this.liquidrc.files as { locales: string }).locales;
    }

    const path = join(this.uri.root.fsPath, input);
    const file = Uri.file(path);

    if (await u.pathExists(file.fsPath)) {

      this.files.locales = file;
      this.completion.files.locales = this.files.locales.fsPath;
      this.info(`${config} locale completions: ${basename(path)}`);

      const schema = Uri.file(file.fsPath.replace(/\.json$/, '.schema.json'));

      if (await u.pathExists(schema.fsPath)) {
        this.files.localeSchema = schema;
        this.info(`${config} locale → schema ref: ${basename(schema.fsPath)}`);
      }

    } else {

      this.warn(`Unable to resolve locale JSON file at: ${path}`);
    }

    return this.getLocaleFile();

  }

  /**
   * Get Locale File
   *
   * Function method for re-parsing and keep an upto date locales references
   */
  async getLocaleFile () {

    if (this.files.locales === null) return this;

    const { fsPath } = this.files.locales;
    const exists = await u.pathExists(fsPath);

    if (exists) {

      try {

        const locales = await u.parseJsonFile(this.files.locales);
        const schema = await u.parseJsonFile(this.files.localeSchema);

        $.liquid.files.set('locales', locales);
        $.liquid.files.set('locales_schema', schema);

      } catch (e) {

        this.catch('JSON Error', e);

      }

    } else {

      this.error(`${fsPath}`)(
        'Unable to resolve a file at the path that was provided.',
        'Completion locales require you reference a file relative to your root.\n'
      );

    }

    return this;
  }

  /**
   * Set Settings File
   *
   * Function method for setting Shopify settings schema completions
   */
  async setSettingsFile () {

    if (this.config.sources.files.settings === ConfigMethod.Undefined) return null;

    let config: 'workspace' | '.liquidrc';
    let input: string;

    if (this.config.sources.files.settings === ConfigMethod.Workspace) {
      config = 'workspace';
      input = workspace.getConfiguration().get<string>('liquid.files.shopify.settings');
    } else {
      config = '.liquidrc';
      input = (this.liquidrc.files as { settings: string }).settings;
    }

    const path = join(this.uri.root.fsPath, input);
    const file = Uri.file(path);

    if (await u.pathExists(file.fsPath)) {

      this.files.settings = file;
      this.completion.files.settings = this.files.settings.fsPath;
      this.info(`${config} settings completions: ${basename(path)}`);

    } else {

      this.warn(`Unable to resolve settings JSON file at: ${path}`);
    }

    return this.getSettingsFile();

  }

  /**
   * Get Settings File
   *
   * Function method for re-parsing and keep an upto settings_schema reference
   */
  async getSettingsFile () {

    if (this.files.settings === null) return this;

    const { fsPath } = this.files.settings;
    const exists = await u.pathExists(fsPath);

    if (exists) {

      try {
        const settings = await u.parseJsonFile<SettingsSchema[]>(this.files.settings);
        getSettingsCompletions(fsPath, settings);

      } catch (e) {

        this.catch('JSON Error', e);

      }

    } else {

      this.error(`${fsPath}`)(
        'Unable to resolve a file at the path that was provided.',
        'Completion settings require you reference a file relative to your root.\n'
      );

    }

    return this;

  }

  /**
   * Get File Source
   *
   * Function method for obtain configuration sources for file completions.
   * The extension allows both workspace and liquidrc configs to be used.
   */
  async getFileSource () {

    if (this.engine === 'standard') {
      return null;
    }

    if (this.engine === 'jekyll') {
      this.warn('Jekyll file paths are not yet supported');
      return null;
    }

    /**
     * Whether or not rcfile exists
     */
    let rcfile = false;

    /**
     * File keys - Differs based on engine definition
     */
    const files: string[] = this.engine === 'shopify' ? [
      'locales',
      'settings',
      'snippets',
      'sections'
    ] : this.engine === '11ty' || this.engine === 'eleventy' ? [
      'data',
      'layouts',
      'includes'
    ] : [];

    /**
     * Workspace Configuration
     */
    const config = workspace.getConfiguration();

    /**
     * Workspace Liquid settings
     */
    const settings = config.inspect<{
      files: Workspace.Files;
      format: Workspace.Format;
    }>('liquid');

    if (this.config.method === ConfigMethod.Liquidrc) {
      if (has('files', this.liquidrc)) {
        if (u.isObject(this.liquidrc.files)) {
          rcfile = true;
        } else if (this.liquidrc.files !== null) {
          this.error(
            'Invalid type provided on "files" in .liquidrc'
          )(
            `The "files" option expects a type object but recieved type: ${typeof this.liquidrc.files}`,
            `Optionally define files in your workspace using "liquid.files.${this.liquidrc.engine}" option.`
          );
        }
      }
    }

    for (const file of files) {

      if (!has(file, this.config.sources.files)) {
        this.config.sources.files[file] = ConfigMethod.Undefined;
      }

      if (rcfile && has(file, this.liquidrc.files)) {
        if (u.isString(this.liquidrc.files[file]) && this.liquidrc.files[file] !== '') {
          this.config.sources.files[file] = ConfigMethod.Liquidrc;
        } else if (u.isArray(this.liquidrc.files[file]) && this.liquidrc.files[file].length > 0) {
          this.config.sources.files[file] = ConfigMethod.Liquidrc;
        }
      }

      if (this.config.sources.files[file] === ConfigMethod.Undefined) {
        if (hasPath(`files.${this.engine}`, settings.workspaceValue)) {

          const option = settings.workspaceValue.files[this.engine][file];

          if (u.isString(option) && option !== '') {
            this.config.sources.files[file] = ConfigMethod.Workspace;
          } else if (u.isArray(option) && option.length > 0) {
            this.config.sources.files[file] = ConfigMethod.Workspace;
          }

        } else if (hasPath(`files.${this.engine}`, settings.globalValue)) {

          this.warn(`Defined "${file}" file paths in user settings will be ignored`);

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
  public getIgnores (rules: string[]) {

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
  public isFormattingOnSave (languageId: string = 'liquid'): boolean {

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
  public getHovers () {

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
  public getValidations () {

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
  public getCompletions () {

    const settings = workspace.getConfiguration().get<Workspace.Validate>('liquid.completion');

    if (u.isObject(settings)) {

      for (const v of [
        'tags',
        'filters',
        'logical',
        'objects',
        'section',
        'schema',
        'snippets',
        'sections',
        'settings',
        'variables'
      ]) {

        if (has(v, settings) && u.isBoolean(settings[v])) {

          if (v === 'section' || v === 'objects' || v === 'schema') {
            if (this.engine !== 'shopify' && settings[v] === true) {
              this.warn(`Completion for ${v} will not work in Liquid ${u.upcase(this.engine)}`);
            }
          }

          if (settings[v] !== this.completion.enable[v]) {
            if (settings[v]) {
              this.info(`enabled ${v} completions`);
            } else {
              this.info(`disabled ${v} completions`);
            }
          }

          this.completion.enable[v] = settings[v];

        } else {

          this.completion.enable[v] = true;

        }
      }
    }

  }

  /**
   * Get Format Rules
   */
  public getFormatRules () {

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

          this.formatting.rules = u.rulesNormalize(rules);

          if (has('ignore', rules)) {

            if (u.isArray(rules.ignore)) {
              if (rules.ignore.length > 0) {
                this.getIgnores(rules.ignore);
              } else {
                if (this.formatting.ignoreList.length > 0) {
                  this.getIgnores([]);
                }
              }
            } else if (this.formatting.ignoreList.length > 0) {
              this.getIgnores([]);
            }

          }

        } else {

          this.formatting.rules = u.rulesDefault();

        }

      } else {

        this.formatting.rules = u.rulesDefault();

      }

    }
  }

  /**
   * Get BaseURL
   *
   * Applied baseURL
   */
  public getBaseUrl () {

    const config = workspace.getConfiguration();
    const { workspaceValue, globalValue } = config.inspect<Workspace.Config>('liquid.config');

    let base: string = null;
    let uri: Uri = null;

    if (u.isUndefined(workspaceValue) && u.isUndefined(globalValue)) {

      base = null;

    } else if (u.isUndefined(workspaceValue)) {

      // Skip if baseURL is undefined
      if (u.isUndefined(globalValue.baseDir) || globalValue.baseDir === '') {
        base = null;
      } else {
        base = workspace.asRelativePath(globalValue.baseDir);
        this.warn('The "config.baseDir" is defined in global workspace configuration (not recommended)');
      }
    } else {

      // Skip if baseURL is undefined
      if (u.isUndefined(workspaceValue.baseDir) || workspaceValue.baseDir === '') {
        base = null;
      } else {
        base = workspace.asRelativePath(workspaceValue.baseDir);
      }

    }

    if (base === null) {

      uri = this.uri.root;

    } else {

      if (/\.liquidrc(?:\.json)?$/.test(base)) {

        const excluding = base.slice(base.lastIndexOf('/'));
        this.warn(`config.baseDir should be a directory path, excluding: ${excluding}`);
        base = base.slice(0, base.lastIndexOf('/'));

      }

      uri = Uri.joinPath(this.uri.root, base);

      if (uri.fsPath !== this.uri.root.fsPath) {

        if (existsSync(uri.fsPath)) {

          this.info(`workspace config.baseDir .liquidrc path: ${uri.path}`);
          this.nl();

        } else {

          this.isActive = false;

          this.error('Invalid "config.baseDir" path provided', '')(
            '\nThe "liquid.config.baseDir" directory cannot be resolved.',
            `  ✓ ${this.uri.root.fsPath}`,
            `  𐄂 ${uri.path}`
          );

          return;
        }
      }

    }

    if (uri.fsPath !== this.uri.base.fsPath) {

      if (this.hasActivated) {

        const path = u.hasLiquidrc(uri.fsPath);

        if (!path) {

          const method = this.config.method === ConfigMethod.Liquidrc
            ? this.uri.liquidrc.fsPath
            : this.uri.workspace.fsPath;

          this.error('Cannot resolve .liquidrc file', '')(
            `\nThe directory provided to config.baseDir (${base}) does not contain a .liquidrc file.`,
            `  ✓ ${method}`,
            `  𐄂 ${uri.fsPath}\n`
          );

        } else {

          this.uri.base = uri;
          this.uri.liquidrc = Uri.file(path);
          this.nl().info(`.liquidrc resolution path: ${uri.path}`).nl();

          return Setting.LiquidrcTouch;

        }

        return;

      } else {
        this.uri.base = uri;
      }

    }

    this.isActive = true;

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
  async getLiquidrc (touch?: Setting) {

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

        this.error(`Invalid configuration type provided in ${basename(this.uri.liquidrc.fsPath)}`)(
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
            files: this.engine === '11ty' ? {
              data: [],
              includes: [],
              layouts: []
            } : {
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

          this.info('Updated the .liquidrc file, you are now the v4.0.0 structure');

          this.liquidrc = update;
          this.deprecation.liquidrc = null;

        }

      }
      if (touch !== Setting.LiquidrcTouch) {

        if (this.deprecation.liquidrc === null) {

          this.getEngine();
          this.getFormatRules();

          await this.getFileCompletions([ 'sections', 'snippets' ]);
          await this.setLocaleFile();
          await this.setSettingsFile();
          await this.getSharedSchema();

        }

      } else {

        u.touch(this.uri.liquidrc.fsPath);

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

      if (!this.hasActivated) this.info(`workspace file: ${this.uri.workspace.path}`);

      this.config.target = ConfigurationTarget.Workspace;
      this.config.inspect = 'workspaceValue';
    } else {
      this.config.target = ConfigurationTarget.Global;
      this.config.inspect = 'globalValue';
    }

    const touch = this.getBaseUrl();

    if (!this.isActive) return;

    await this.getLiquidrc(touch);

    if (this.isReady === false) {

      this.deprecation.workspace = u.hasDeprecatedSettings();

      if (this.deprecation.workspace === '4.0.0') {
        const updated = await this.fixWorkspace();
        if (updated) {
          this.info('Updated to the latest v4.0.0 workspace settings structure');
        }
      }
    }

    await this.getFileSource();

    if (this.engine === 'shopify') {

      if (this.config.method === ConfigMethod.Workspace) {
        await this.getFileCompletions([ 'sections', 'snippets' ]);
        await this.setLocaleFile();
        await this.setSettingsFile();
        await this.getSharedSchema();
      }

    } else if (this.engine === '11ty' || this.engine === 'eleventy') {

      await this.getFileCompletions([
        'data',
        'includes',
        'layouts'
      ]);

    }

    this.getCompletions();
    this.getValidations();
    this.getHovers();
    this.getFormatRules();

  };

}
