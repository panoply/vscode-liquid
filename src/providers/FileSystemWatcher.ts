import { basename } from 'node:path';
import { commands, FileSystemWatcher, Uri, workspace } from 'vscode';
import prettify from '@liquify/prettify';
import { Config, Setting } from 'types';
import { isFile } from 'utils';
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
    workspace.createFileSystemWatcher('**/.liquidr{c,c.json}'),
    workspace.createFileSystemWatcher('**/package.json')
  ];

  /**
   * Watched change was config
   */
  private isMatch (fsPath: string) {

    return (
      fsPath !== this.liquidrcPath &&
      fsPath !== this.packagePath
    );

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

    const isPackage = isFile(fsPath, 'package.json');

    if (isPackage) {

      if (this.configMethod === Config.Liquidrc) return null;

      const before = this.configMethod;
      const pkg = await this.getPackage();

      if (this.configMethod === Config.Package) {
        if (pkg === Setting.PrettifyFieldDefined) {

          prettify.options(this.prettifyRules);

          if (before === Config.Workspace) {
            this.formatIgnore.clear();
            this.formatRegister.clear();
            this.info('Using "prettify" field in package.json file');
          }

          this.info('Updated Prettify beautification rules');

        } else if (pkg === Setting.PrettifyFieldUndefined) {

          this.getSettings(Config.Workspace);
          this.formatIgnore.clear();
          this.formatRegister.clear();
          this.info('Using workspace settings for configuration');

        }
      } else if (pkg === Setting.PrettifyFieldDefined) {
        prettify.options(this.prettifyRules);
        this.dispose();
        this.info('Using "prettify" field in package.json file');
      }

    } else {

      const liquidrc = await this.getLiquidrc();

      if (liquidrc === Setting.LiquidrcDefined) {
        prettify.options(this.prettifyRules);
        this.info('Updated Prettify beautification rules');
        this.changed = true;
        if (this.deprecatedConfig === true) {
          this.deprecatedConfig = false;
          this.languageDispose();
        }
      }
    }

  }

  private async onDidCreate ({ fsPath }: Uri) {

    const isPackage = isFile(fsPath, 'package.json');

    if (this.liquidrcPath === null && isPackage === false) {
      this.liquidrcPath = fsPath;
      this.info('Created .liquidrc file, this will be used for formatting setting');
    }

    if (this.isMatch(fsPath)) return null;

    this.dispose();

    if (isPackage) {

      if (this.configMethod === Config.Workspace) return;

      const pkg = await this.getPackage();

      if (pkg === Setting.PrettifyFieldDefined) {
        prettify.options(this.prettifyRules);
        commands.executeCommand('liquid.restartExtension');
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

        if (this.deprecatedConfig === true) {
          this.deprecatedConfig = false;
          this.languageDispose();
        }

        this.status.enable();
        this.changed = true;

        commands.executeCommand('liquid.restartExtension');
      }
    }

  }

  private async onDidDelete ({ fsPath }: Uri) {

    if (this.isMatch(fsPath)) return null;

    const isPackage = isFile(fsPath, 'package.json');

    this.dispose();

    if (isPackage) {

      this.getSettings(Config.Workspace);
      this.info('Using workspace settings for configuration');

    } else {

      const pkg = await this.getPackage();

      if (pkg === Setting.PrettifyFieldDefined) {

        prettify.options(this.prettifyRules);
        this.info('Using "prettify" field in package.json file');

      } else {

        this.getSettings(Config.Workspace);
        this.info('Using workspace settings for configuration');

      }
    }

  }

}
