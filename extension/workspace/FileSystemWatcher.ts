import { basename } from 'node:path';
import { commands, FileSystemWatcher, GlobPattern, Uri, workspace } from 'vscode';
import esthetic from 'esthetic';
import { ConfigMethod, Setting } from '../types';
import { has } from 'rambdax';
import { isArray } from '../utils';
import { NotificationMessage } from './NotificationMessage';

/**
 * File System Watcher
 *
 * Logic pertaining to FS operations, like watching files or directories
 * in the workspace and then acting in accordance to different actions.
 *
 * ---
 *
 * The `WorkspaceSettings` class will extend next.
 */
export class FSWatch extends NotificationMessage {

  /**
   * Whether or not the file system watcher is running
   *
   * @default false
   */
  public isWatching: boolean = false;

  /**
   * File System Watchers
   *
   * Defaults to observing for .liquidrc files.
   */
  private watchers: FileSystemWatcher[] = [
    workspace.createFileSystemWatcher('**/.liquidr{c,c.json}')
  ];

  /**
   * File System Watch watchings
   *
   * Keeps track of glob paths being observed. The `Map` key
   * will hold the path provided to `addWatchers` and the value
   * is the `watchers` index.
   */
  private watching: Map<GlobPattern, number> = new Map();

  /**
   * Watched change was config
   */
  private isRC (fsPath: string) {
    return fsPath !== this.uri.liquidrc.fsPath;
  }

  /**
   * Add Watcher Glob
   *
   * Create a new watch instance
   */
  public addWatchGlob (glob: GlobPattern | GlobPattern[]) {

    const paths = isArray(glob) ? glob : [ glob ];

    for (const path of paths as GlobPattern[]) {
      if (this.watching.has(path)) {
        this.info(`Path "${path}" is already being observed`);
      } else {

        const watch = workspace.createFileSystemWatcher(path);

        watch.onDidCreate(this.onDidCreate, this);
        watch.onDidChange(this.onDidChange, this);
        watch.onDidDelete(this.onDidDelete, this);

        this.watchers.push(watch);
        this.watching.set(path, this.watchers.length - 1);

      }
    }

  }

  /**
   * Remove Watching
   *
   * Remove a watched glob, requires an existing watch Glob
   * to be provided in order for disposal match to succeed.
   */
  public removeWatcher (glob: GlobPattern) {

    if (this.watching.has(glob)) {

      const index = this.watching.get(glob);

      this.watchers[index].dispose();
      this.watchers.splice(index, 1);
      this.watching.delete(glob);

      this.info(`Stopped watching and disposed "${glob}" entry.`);

    } else {

      this.info(`Path "${glob}" does not exist and therefore cannot be removed`);
    }

  }

  /**
   * File System Watcher - Invoke Watchers
   *
   * Starts watching the `.liquidrc` file for changes.
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
   * File System Watcher
   *
   * Callback for the `onDidChange` event
   */
  private async onDidChange (uri: Uri) {

    if (this.isRC(uri.fsPath)) return null;

    const liquidrc = await this.getLiquidrc();

    if (liquidrc === Setting.LiquidrcDefined) {

      esthetic.rules(this.formatting.rules);

      this.isDirty = true;
      this.info('Updated .liquidrc file configuration');

    }

  }

  /**
   * File System Watcher
   *
   * Callback for the `onDidCreate` event
   */
  private async onDidCreate (uri: Uri) {

    const { fsPath } = uri;

    if (this.uri.liquidrc === null) {
      this.uri.liquidrc = uri;
      this.info('Created .liquidrc file, this will be used for extension capabilities');
    }

    if (this.isRC(fsPath)) return null;

    const fileName = basename(fsPath);

    if (this.config.method === ConfigMethod.Workspace) {
      this.info(`The ${fileName} settings override liquid.format.rules configurations in the workspace`);
    }

    this.info(`Using .liquidrc file: ${fsPath}`);

    const liquidrc = await this.getLiquidrc();

    if (liquidrc === Setting.LiquidrcDefined) {

      if (this.formatting.enable) {
        this.status.enable();
      } else {
        this.status.disable();
      }

      commands.executeCommand('liquid.restartExtension');

    }

  }

  /**
   * File System Watcher
   *
   * Callback for the `onDidDelete` event
   */
  private async onDidDelete ({ fsPath }: Uri) {

    if (this.isRC(fsPath)) return null;

    this.config.method = ConfigMethod.Workspace;
    this.info('Using workspace settings for configuration');

  }

}
