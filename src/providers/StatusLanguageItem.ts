import { Command, languages, LanguageStatusItem, LanguageStatusSeverity } from 'vscode';
import { Providers } from 'providers';

export class StatusLanguageItem extends Providers {

  private languageItems: Set<LanguageStatusItem> = new Set();

  /**
   * Dispose Language Status Items
   */
  public languageDispose () {

    if (this.languageItems.size > 0) {
      for (const item of this.languageItems) {
        item.dispose();
      }
    }
  }

  /**
   * Language Item Error
   */
  public languageError (message: string[], command?: Command) {

    const error = languages.createLanguageStatusItem('Liquid Errors', this.selector.active);
    error.severity = LanguageStatusSeverity.Error;
    error.text = message.join(' ');

    if (command) error.command = command;

    this.languageItems.add(error);

  }

}
