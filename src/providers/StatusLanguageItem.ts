import { Command, languages, LanguageStatusItem, LanguageStatusSeverity } from 'vscode';
import { State } from 'state';

export class StatusLanguageItem extends State {

  items: Set<LanguageStatusItem> = new Set();

  /**
   * Dispose Language Status Items
   */
  languageDispose () {

    if (this.items.size > 0) {
      for (const item of this.items) {
        item.dispose();
      }
    }
  }

  languageError (message: string[], command?: Command) {

    const error = languages.createLanguageStatusItem('Liquid Errors', this.selector.active);
    error.severity = LanguageStatusSeverity.Error;
    error.text = message.join(' ');

    if (command) error.command = command;

    this.items.add(error);

  }

}
