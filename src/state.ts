/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */

import { ConfigurationTarget, workspace, Extension, Memento } from 'vscode';
import { Merge } from 'type-fest';
import { Config, LanguageIds, PackageJSON } from 'types';
import { join } from 'node:path';
import { Tester } from 'anymatch';
import prettify, { Options } from '@liquify/prettify';

/**
 * Extension State - Localized store for the extension
 */
export class State {

  constructor ({ packageJSON }: Merge<Extension<any>, { packageJSON: PackageJSON }>) {
    this.version = packageJSON.version;
    this.id = packageJSON.name;
    this.repository = packageJSON.repository.url;
    this.displayName = packageJSON.displayName;
    this.prettifyVersion = packageJSON.dependencies['@liquify/prettify'];
    this.rootPath = workspace.workspaceFolders[0].uri.fsPath;
    this.packagePath = join(this.rootPath, 'package.json');

  }

  /**
   * The extension official identifier, ie: sissel.vscode-liquid
   */
  id: string;

  /**
   * Github Repostory URL
   */
  displayName: string;

  /**
   * Github Repostory URL
   */
  repository: string;

  /**
   * Extension version
   */
  version: string;

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
   * Whether or not a warning has occured
   *
   * @default false
   */
  hasWarning: boolean = false;

  /**
   * Set list of the default languages we apply formatting to
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
    'typescript': false,
    'yaml': false
  };

  /**
   * Document Selector
   */
  selector: Array<{ language: LanguageIds; scheme: 'file' }> = [
    { scheme: 'file', language: 'liquid' },
    { scheme: 'file', language: 'liquid-css' },
    { scheme: 'file', language: 'liquid-scss' },
    { scheme: 'file', language: 'liquid-javascript' },
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
  ];

}
