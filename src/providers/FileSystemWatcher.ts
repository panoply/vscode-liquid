import { basename } from 'node:path';
import { commands, FileSystemWatcher, Uri, workspace } from 'vscode';
import prettify from '@liquify/prettify';
import { ConfigMethod, Setting } from 'types';
import { FSUtils } from 'providers/FileSystemUtilities';
import { has } from 'rambdax';

export class FSWatch extends FSUtils {

  /**
   * Whether or not the file system watcher is running
   *
   * @default false
   */
  public isWatching: boolean = false;

  /**
   * Whether or not a watched file has changed
   *
   * @default false
   */
  private changed: boolean = false;

  /**
   * File System Watchers
   */
  private watchers: FileSystemWatcher[] = [
    workspace.createFileSystemWatcher('**/.liquidr{c,c.json}')
  ];

  /**
   * Watched change was config
   */
  private isMatch (fsPath: string) {

    return fsPath !== this.uri.liquidrc.fsPath;

  }

  public addWatchers () {

  }

  /**
   * File System Watcher - Invoke Watchers
   *
   * Starts watching the `.liquidrc` file and `package.json` for changes.
   * Passing a `false` parameter will dispose the watchers.
   *
   * @param dispose boolean
   */
  public getWatchers (dispose?: boolean) {

    for (const watch of this.watchers) {
      if (dispose === false && has('dispose', watch)) {
        watch.dispose();
      } else {
        watch.onDidCreate(this.onDidCreate, this);
        watch.onDidChange(this.onDidChange, this);
        watch.onDidDelete(this.onDidDelete, this);
      }
    }
  };

  /**
   * File System Watcher - `onDidChange` event
   */
  private async onDidChange ({ fsPath }: Uri) {

    if (this.isMatch(fsPath)) return null;
    if (this.changed) return (this.changed = false);

    const liquidrc = await this.getLiquidrc({ fixDeprecated: false });

    if (liquidrc === Setting.LiquidrcDefined) {
      prettify.options(this.format.rules);
      this.info('Updated formatting rules');
      this.changed = true;
    }

  }

  private async onDidCreate (uri: Uri) {

    const { fsPath } = uri;

    if (this.uri.liquidrc === null) {
      this.uri.liquidrc = uri;
      this.info('Created .liquidrc file, this will be used for extension capabilities');
    }

    if (this.isMatch(fsPath)) return null;

    this.dispose();

    const fileName = basename(fsPath);

    if (this.config.method === ConfigMethod.Workspace) {
      this.info(`The ${fileName} settings override "liquid.format.rules" configurations in the workspace`);
    }

    this.info(`Using .liquidrc file: ${fsPath}`);

    const liquidrc = await this.getLiquidrc({ fixDeprecated: false });

    if (liquidrc === Setting.LiquidrcDefined) {
      this.status.enable();
      this.changed = true;
      commands.executeCommand('liquid.restartExtension');
    }

  }

  private async onDidDelete ({ fsPath }: Uri) {

    if (this.isMatch(fsPath)) return null;

    this.dispose();
    this.config.method = ConfigMethod.Workspace;
    this.info('Using workspace settings for configuration');

  }

}
