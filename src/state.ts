/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */

import { ConfigurationTarget, Disposable, Extension, workspace } from 'vscode';
import { Config, LanguageIds, PackageJSON, Selectors, Workspace } from 'types';
import { relative } from 'node:path';
import { Tester } from 'anymatch';
import prettify, { Options } from '@liquify/prettify';
import { Engines } from '@liquify/liquid-language-specs';

/**
 * Extension State - Localized store for the extension
 */
export class State {

  constructor ({ packageJSON, isActive }: Extension<PackageJSON>) {
    this.isActive = isActive;
    this.version = `v${packageJSON.version}`;
    this.id = packageJSON.name;
    this.repository = packageJSON.repository.url;
    this.displayName = packageJSON.displayName;
    this.prettifyVersion = packageJSON.dependencies['@liquify/prettify'];
    this.fsPath = workspace.workspaceFolders[0].uri.fsPath;
    this.rootPath = this.fsPath;
  }

  /**
   * Get Relative file path
   *
   * Returns the relative path of a the provided `uri`
   * using the `fsPath` base location.
   */
  relative = (path: string) => relative(this.rootPath, path);

  /**
   * Deprecated Configurations
   */
  deprecatedConfig: boolean = false;
  /**
   * The  Liquid engine
   *
   * @default 'shopify'
   */
  engine: Engines = 'shopify';

  /**
   * Which validations are enabled
   */
  canValidate: Workspace.Validate = {
    schema: true
  };

  /**
   * Which completions are enabled
   */
  canComplete: Workspace.Completion = {
    tags: true,
    filters: true,
    objects: true,
    operators: true,
    section: true
  };

  /**
   * The extension official identifier, ie: sissel.vscode-liquid
   */
  id: string = 'sissel.shopify-liquid';

  /**
   * Github Repostory URL
   */
  displayName: string = 'Liquid';

  /**
   * Github Repostory URL
   */
  repository: string = 'https://github.com/panoply/vscode-liquid';

  /**
   * Extension version
   */
  version: string;

  /**
   * The workspace `fsPath`
   *
   * @default null
   */
  fsPath: string = null;
  /**
   * Base URL path (`null` if not provided)
   *
   * @default null
   */
  baseUrl: string = null;
  /**
   * URI root path of the project
   *
   * @default fsPath
   */
  rootPath: string;

  /**
   * URI Path to the `package.json` file
   *
   * @default fsPath/package.json
   */
  packagePath: string;

  /**
   * URI Path to the `.liquidrc` files
   *
   * @default null
   */
  liquidrcPath: string = null;

  /**
   * The extension configuration method being used
   *
   * @default Config.Workspace
   */
  configMethod: Config = Config.Workspace;

  /**
   * The workspace target
   *
   * @default ConfigurationTarget.Workspace
   */
  configTarget: ConfigurationTarget = ConfigurationTarget.Workspace;

  /**
   * A reference to the ignored list of files.
   *
   * @default []
   */
  ignoreList: string[] = [];

  /**
   * Anymatch pattern for ignored paths
   *
   * @default null
   */
  ignoreMatch: Tester = null;

  /**
   * Prettify version
   */
  prettifyVersion: string;

  /**
   * The current formatting rules
   */
  prettifyRules: Options = prettify.options.rules;

  /**
   * Whether or not formatting is enabled
   *
   * @default false
   */
  canFormat: boolean = false;

  /**
   * The formatting handler
   */
  formatHandler: Disposable = null;

  /**
   * Set list of ignore paths
   */
  formatIgnore: Set<string> = new Set();

  /**
   * Set list of `fsPath` URI paths
   */
  formatRegister: Set<string> = new Set();

  /**
   * Whether or not the extension was activated
   *
   * @default false
   */
  isActive: boolean = false;

  /**
   * Whether or not an action was invoked from command
   *
   * @default false
   */
  isCommand: boolean = false;

  /**
   * Whether or not the extension has initialized
   *
   * @default false
   */
  isReady: boolean = false;

  /**
   * Whether the extension is in a state of loading
   *
   * @default false
   */
  isLoading: boolean = false;

  /**
   * Whether or not an error has occured
   *
   * @default false
   */
  hasError: boolean = false;

  /**
   * Document Selectors
   *
   * The document selector list of languages passed to
   * providers. The `active` property contains the in~use
   * selectors. The `liquid` property is the default selectors
   * and the `extend` is the additional languages that can
   * be handled.
   */
  selector: Selectors = {
    active: [
      { scheme: 'file', language: 'liquid' },
      { scheme: 'file', language: 'liquid-css' },
      { scheme: 'file', language: 'liquid-scss' },
      { scheme: 'file', language: 'liquid-javascript' }
    ],
    liquid: [
      { scheme: 'file', language: 'liquid' },
      { scheme: 'file', language: 'liquid-css' },
      { scheme: 'file', language: 'liquid-scss' },
      { scheme: 'file', language: 'liquid-javascript' }
    ],
    extend: [
      { scheme: 'file', language: 'html' },
      { scheme: 'file', language: 'xml' },
      { scheme: 'file', language: 'css' },
      { scheme: 'file', language: 'scss' },
      { scheme: 'file', language: 'sass' },
      { scheme: 'file', language: 'json' },
      { scheme: 'file', language: 'jsonc' },
      { scheme: 'file', language: 'javascript' },
      { scheme: 'file', language: 'typescript' },
      { scheme: 'file', language: 'jsx' },
      { scheme: 'file', language: 'tsx' }
    ]
  };

  /**
   * Languages determination
   *
   * Holds a reference to which language selectors are
   * currently enabled/disabled.
   */
  languages: { [K in LanguageIds]: boolean } = {
    'liquid': true,
    'liquid-css': true,
    'liquid-scss': true,
    'liquid-javascript': true,
    'xml': false,
    'html': false,
    'json': false,
    'jsonc': false,
    'css': false,
    'sass': false,
    'scss': false,
    'less': false,
    'jsx': false,
    'tsx': false,
    'javascript': false,
    'typescript': false
  };

}
