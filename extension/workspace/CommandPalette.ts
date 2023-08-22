import { env, Uri, window, workspace } from 'vscode';
import { join } from 'node:path';
import esthetic, { LanguageName } from 'esthetic';
import { getLanguage, getRange, isString, pathExists, rulesDefault, rulesRecommend } from '../utils';
import { FSWatch } from './FileSystemWatcher';
import { FormatEventType } from 'providers/FormattingProvider';

/**
 * Commands
 *
 * Command palette execution
 */
export class CommandPalette extends FSWatch {

  /**
   * Holds a cache copy of an error, typically returned by esthetic
   */
  public errorCache: string = null;

  public getFormatter () {

    esthetic.on('format', ({ stats }) => {
      if (!this.hasError) {
        this.info(`${stats.language} formatted in ${stats.time}`);
      }
    });

  }

  public deprecatedSettings () {

  }

  public async releaseNotes () {

    return env.openExternal(this.meta.releaseNotes);

  }

  private async generateLiquidrc (type: 'default' | 'recommended') {

    const exists = await pathExists(this.uri.liquidrc.fsPath);

    let action: string;

    if (exists) {

      action = await this.notifyInfo([
        'Open',
        'Overwrite'
      ], [
        'Your workspace already contains a .liquidrc file. You can overwrite the existing',
        `config with ${type} rules or open the file and inspect the formatting options.`
      ]);

      if (action === 'OPEN') return this.openDocument(this.uri.liquidrc.fsPath);

    } else {

      action = await this.notifyInfo([
        '.liquidrc',
        '.liquidrc.json'
      ], [
        'Choose a .liquidrc file type to be created. It does not matter which you select,',
        'both will be interpreted as JSONC (JSON with Comments) language types.'
      ]);

      if (action === '.LIQUIDRC.JSON' || action === '.LIQUIDRC') {

        this.uri.liquidrc = Uri.file(join(this.uri.root.fsPath, action.toLowerCase()));

      }
    }

    if (isString(action)) {

      const input = type === 'default' ? rulesDefault() : rulesRecommend();
      const stringify = JSON.stringify(input, null, 2);
      const rules = esthetic.format(stringify, { ...input, language: 'json' });

      esthetic.rules({ language: 'liquid' });

      try {

        const content = Buffer.from(rules);

        await workspace.fs.writeFile(this.uri.liquidrc, new Uint8Array(content));

        this.info('Generated .liquidrc file: ' + this.uri.liquidrc.path);

        return this.openDocument(this.uri.liquidrc.fsPath);

      } catch (e) {
        this.catch('Failed to write .liquidrc file to workspace root', e);
      }

    } else {

      this.info('Cancelled .liquidrc file generation');

    }
  }

  public liquidrcDefaults () {

    return this.generateLiquidrc('default');
  }

  /**
   * Enabled formatting (command)
   */
  public async enableFormatting () {

    const { languageId } = window.activeTextEditor.document;

    if (!this.isDefaultFormatter(languageId)) {

      const answer = await this.notifyError([ 'Yes', 'No' ], [
        'VSCode Liquid supports formatting but is not defined as the default formatter',
        'Do you want to use VSCode Liquid (Æsthetic) to format your Liquid files?'
      ]);

      if (answer === 'YES') {
        const updated = await this.setDefaultFormatter(languageId);
        if (!updated) return null;
      } else {

        return null;
      }

    }

    await this.setFormatOnSave(languageId, true);

  }

  /**
   * Disable formatting (command)
   */
  public async disableFormatting () {

    await this.setFormatOnSave(window.activeTextEditor.document.languageId, false);

  }

  /**
   * Formats the entire document
   */
  public async formatDocument () {

    if (window.activeTextEditor === undefined) return;

    const { document } = window.activeTextEditor;
    const { languageId } = document;

    let language: LanguageName;

    if (/\.liquidrc(?:\.json)?/.test(document.fileName)) {
      language = 'json';
    } else {
      language = getLanguage(document.languageId);
    }

    if (this.languages.has(languageId)) {

      const range = getRange(document);
      const source = document.getText(range);

      if (this.hasError) {
        this.hasError = false;
        this.error = null;
        this.listen.fire(FormatEventType.EnableStatus);
      }

      try {

        const output = esthetic.format(source, { language });

        await window.activeTextEditor.edit(code => code.replace(range, output));

      } catch (e) {

        if (this.hasError === false || this.error !== e.message) {
          this.error = e.message;
          this.hasError = true;
          this.listen.fire({
            type: FormatEventType.ThrowError,
            message: 'Parse error occured when formatting document\n',
            detail: e.message
          });
        }
      }

    } else {

      if (languageId === 'liquid') {
        this.warn('Language id "Liquid" is not enabled');
      } else {
        this.warn('Language id "' + languageId.toUpperCase() + '" is not enabled');
      }
    }

  }

  /**
   * Formats the document text using command
   */
  public async onCommandDocumentFormat () {

    if (window.activeTextEditor === undefined) return;

    try {
      await this.formatDocument();
      window.showInformationMessage('Document Formatted');
    } catch {
      window.showInformationMessage('Formatting Failed! The document could not be beautified, see output.');
    }
  }

}
