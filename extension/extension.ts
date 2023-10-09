/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */
import { Engines } from '@liquify/specs';
import { Config, URI, Meta, Files } from './typings/store';
import { Liquidrc, PackageJSON } from './typings/files';
import { Selectors, LanguageIds } from './typings/document';
import { ConfigurationTarget, Extension as IExtension, Uri, workspace, Disposable, EventEmitter } from 'vscode';
import { ConfigMethod } from './typings/enums';
import { Service } from './services';
import { FormatEvent } from 'providers/FormattingProvider';

/**
 * Extension State - Localized store for the extension
 */
export class Extension extends Service {

  constructor ({ packageJSON, isActive }: IExtension<PackageJSON>) {

    super();

    this.isActive = isActive;
    this.uri.root = workspace.workspaceFolders[0].uri;
    this.uri.base = this.uri.root;
    this.uri.workspace = Uri.joinPath(this.uri.root, '.vscode', 'settings.json');
    this.meta.version = packageJSON.version;
    this.meta.displayName = packageJSON.displayName;
    this.meta.estheticVersion = packageJSON.dependencies.esthetic;
    this.meta.releaseNotes = Uri.parse(`${this.meta.repository}/releases/tag/v${this.meta.version}`);

  }

  /**
   * Files Getter
   *
   * Basic shortcut which will return current
   * workspace files based on current engine. This is merely
   * sugar for `this.uri.files.*`
   *
   * > Currently only Shopify variation files are supported.
   */
  get files (): Files.Shopify & Files.Eleventy {

    return this.uri.files[this.engine];

  }

  /**
   * Error event
   */
  listen: EventEmitter<FormatEvent> = new EventEmitter();

  /**
   * Meta Information
   *
   * Some common data which describes the extension.
   */
  meta: Meta = {
    releaseNotes: null,
    version: null,
    estheticVersion: null,
    displayName: null,
    id: 'sissel.shopify-liquid',
    projectName: 'vscode-liquid',
    repository: 'https://github.com/panoply/vscode-liquid'
  };

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
   * The Liquid engine
   *
   * @default 'shopify'
   */
  engine: '11ty' | Engines = 'shopify';

  /**
   * Copy of the parsed `.liquidrc` file
   *
   * @default null
   */
  liquidrc: Liquidrc = null;

  /**
   * URI path referenced used by the extension
   */
  uri: URI = {
    env: null,
    base: null,
    root: null,
    liquidrc: null,
    workspace: null,
    files: {
      jekyll: {
        collectons: null,
        data: null,
        includes: null,
        layouts: null
      },
      '11ty': {
        data: null,
        includes: new Set(),
        layouts: new Set()
      },
      shopify: {
        locales: null,
        localeSchema: null,
        settings: null,
        sharedSchema: new Set(),
        snippets: new Set(),
        sections: new Set(),
        sectionGroups: new Set()
      }
    }
  };

  /**
   * The configuration target to use
   *
   * @default ConfigurationTarget.Global
   */
  config: Config = {
    target: ConfigurationTarget.Global,
    inspect: 'globalValue',
    method: ConfigMethod.Liquidrc,
    sources: {
      files: {},
      setting: {}
    }
  };

  /**
   * Whether or not formatting is enabled
   *
   * @default false
   */
  canFormat: boolean = false;

  /**
   * Whether or not the extension was activated
   *
   * @default false
   */
  isActive: boolean = false;

  /**
   * Despite the name, this value is used to make a document
   * dirty, typically after a change to formatting rules.
   *
   * @default false
   */
  isDirty: boolean = false;

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
   * Whether or the extension has already activated - This is used to
   * determine when configuration changes take place after initialisation.
   *
   * @default false
   */
  hasActivated: boolean = false;

  /**
   * Whether or not an error has occured
   *
   * @default false
   */
  hasError: boolean = false;

  /**
   * Whether or not the workspace contains a `.liquidrc` file.
   *
   * @default false
   */
  hasLiquidrc: boolean = false;

  /**
   * Document Selectors
   *
   * The document selector list of languages passed to
   * providers. The `active` property contains the in~use
   * selectors. The `liquid` property is the default selectors
   * and the `extend` is the additional languages that can
   * be handled.
   */
  selector: Selectors = [
    { scheme: 'file', language: 'liquid' },
    { scheme: 'file', language: 'liquid-css' },
    { scheme: 'file', language: 'liquid-scss' },
    { scheme: 'file', language: 'liquid-javascript' }
  ];

  /**
   * Languages determination
   *
   * Holds a an actionable reference. We will determine
   * how the extension behaves when dealing with these
   * language schemes
   */
  languages: Map<LanguageIds, boolean> = new Map([
    [ 'liquid', true ],
    [ 'liquid-css', true ],
    [ 'liquid-scss', true ],
    [ 'liquid-javascript', true ],
    [ 'json', false ],
    [ 'jsonc', false ],
    [ 'markdown', false ],
    [ 'xml', false ],
    [ 'html', false ],
    [ 'css', false ],
    [ 'sass', false ],
    [ 'scss', false ],
    [ 'less', false ],
    [ 'jsx', false ],
    [ 'tsx', false ],
    [ 'javascript', false ],
    [ 'typescript', false ]
  ]);

}
