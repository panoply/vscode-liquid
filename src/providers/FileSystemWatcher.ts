import prettify from '@liquify/prettify';
import { basename, join } from 'node:path';
import { FileSystemWatcher, Uri, workspace } from 'vscode';
import { Config, Setting } from '../types';
import { isFile } from '../utils';
import { Settings } from './WorkspaceSettings';
import { has } from 'rambdax';

export class FSWatch extends Settings {

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
    workspace.createFileSystemWatcher(join(this.rootPath, '.liquidr{c,c.json}')),
    workspace.createFileSystemWatcher(this.packagePath)
  ];

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

    if (this.changed) return (this.changed = false);

    const isPackage = isFile(fsPath, 'package.json');

    if (isPackage) {

      if (this.configMethod === Config.Liquidrc) return null;

      const pkg = await this.getPackage();

      if (this.configMethod === Config.Package) {
        if (pkg === Setting.PrettifyFieldDefined) {

          prettify.options(this.prettifyRules);
          this.info('Updated Prettify beautification rules');

        } else if (pkg === Setting.PrettifyFieldUndefined) {

          this.getSettings(Config.Workspace);
          this.info('Using workspace settings');

        }
      } else if (pkg === Setting.PrettifyFieldDefined) {
        prettify.options(this.prettifyRules);
        this.info('Using "prettify" field in package.json file');
      }

    } else {

      const liquidrc = await this.getLiquidrc();

      if (liquidrc === Setting.LiquidrcDefined) {
        prettify.options(this.prettifyRules);
        this.info('Updated Prettify beautification rules');
        this.changed = true;
      }
    }

  }

  private async onDidCreate ({ fsPath }: Uri) {

    const isPackage = isFile(fsPath, 'package.json');

    if (isPackage) {

      if (this.configMethod === Config.Workspace) return;

      const pkg = await this.getPackage();

      if (pkg === Setting.PrettifyFieldDefined) {
        prettify.options(this.prettifyRules);
        this.info('Using "prettify" field in package.json file');
      }

    } else {

      const fileName = basename(fsPath);

      if (this.configMethod === Config.Package) {
        this.info(`The ${fileName} overrides the "prettify" field in package.json files`);
      }

      if (this.configMethod === Config.Workspace) {
        this.info(`The ${fileName} settings override "liquid.format.*" configurations in the workspace`);
      }

      this.info(`Using .liquidrc file: ${fsPath}`);

      const liquidrc = await this.getLiquidrc();

      if (liquidrc === Setting.LiquidrcDefined) {
        this.status.enable();
        prettify.options(this.prettifyRules);
        this.info('Updated Prettify beautification rules');
        this.changed = true;
      }
    }

  }

  private async onDidDelete ({ fsPath }: Uri) {

    const isPackage = isFile(fsPath, 'package.json');

    if (isPackage) {

      this.getSettings(Config.Workspace);
      this.info('Using workspace settings');

    } else {

      const pkg = await this.getPackage();

      if (pkg === Setting.PrettifyFieldDefined) {

        prettify.options(this.prettifyRules);
        this.info('Using "prettify" field in package.json file');

      } else {

        this.getSettings(Config.Workspace);
        this.info('Using workspace settings');

      }
    }

  }

}
