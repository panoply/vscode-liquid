/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */

import { ConfigurationTarget, Extension, Uri, workspace } from 'vscode';
import prettify from '@liquify/prettify';
import { Engines } from '@liquify/liquid-language-specs';
import { clone } from 'rambdax';
import * as T from 'types';

/**
 * Extension State - Localized store for the extension
 */
export class State {

  constructor ({ packageJSON, isActive }: Extension<T.PackageJSON>) {

    this.isActive = isActive;
    this.uri.root = workspace.workspaceFolders[0].uri;
    this.uri.workspace = Uri.joinPath(this.uri.root, '.vscode', 'settings.json');
    this.meta.version = packageJSON.version;
    this.meta.displayName = packageJSON.displayName;
    this.meta.prettifyVersion = packageJSON.dependencies['@liquify/prettify'];
    this.meta.releaseNotes = Uri.parse(`${this.meta.repository}/releases/tag/v${this.meta.version}`);

  }

  /**
   * Meta Information
   *
   * Some common data which describes the extension.
   */
  meta: T.Meta = {
    releaseNotes: null,
    version: null,
    prettifyVersion: null,
    displayName: null,
    id: 'sissel.shopify-liquid',
    projectName: 'vscode-liquid',
    repository: 'https://github.com/panoply/vscode-liquid'
  };

  /**
   * Trigger Characters
   *
   * Used for completions, the following triggers character.
   */
  triggers: string[] = [
    '%',
    '|',
    ':',
    '.',
    '"',
    "'",
    ' '
  ];

  /**
   * Whether or not a deprecation was detected.
   * When `null` no deprecations were found, if `string`
   * value then deprecation was detected.
   */
  deprecation: { liquidrc: string; workspace: string } = {
    liquidrc: null,
    workspace: null
  };

  /**
   * The  Liquid engine
   *
   * @default 'shopify'
   */
  engine: Engines = 'shopify';

  /**
   * Copy of the parsed `.liquidrc` file
   *
   * @default null
   */
  liquidrc: T.Liquidrc = null;

  /**
   * URI path referenced used by the extension
   */
  uri: T.URI = {
    env: null,
    root: null,
    liquidrc: null,
    workspace: null,
    files: {
      locales: null,
      sections: null,
      settings: null,
      snippets: null
    }
  };

  /**
   * Format related configuration
   */
  format: T.Format = {
    ignoreList: [],
    ignoreMatch: null,
    ignored: new Set(),
    register: new Set(),
    handler: null,
    rules: clone(prettify.options.rules)
  };

  /**
   * Format related configuration
   */
  config: T.Config = {
    method: T.ConfigMethod.Undefined,
    target: ConfigurationTarget.Workspace
  };

  /**
   * Whether or not the extension can active
   *
   * @default true
   */
  canActivate: boolean = true;

  /**
   * Whether or not formatting is enabled
   *
   * @default false
   */
  canFormat: boolean = false;

  /**
   * Which hovers are enabled
   */
  canHover: T.Workspace.Hover = {
    tags: true,
    filters: true,
    objects: true,
    schema: true
  };

  /**
   * Which validations are enabled
   */
  canValidate: T.Workspace.Validate = {
    schema: true
  };

  /**
   * Which completions are enabled
   */
  canComplete: T.Workspace.Completion = {
    tags: true,
    filters: true,
    objects: true,
    operators: true,
    section: true,
    logical: true,
    schema: true
  };

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
  selector: T.Selectors = {
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
  languages: { [K in T.LanguageIds]: boolean } = {
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

  /**
   * Completion Store
   *
   * Holds a cache reference of completion items generated
   * in Liquid variations that support them.
   */
  complete: T.Completions = {
    textEdit: [],
    tags: null,
    logical: null,
    filters: null,
    objects: null,
    common: null,
    snippets: null,
    sections: null,
    settings: {
      file: null,
      items: null
    },
    locales: {
      file: null,
      items: null
    }
  };

}
