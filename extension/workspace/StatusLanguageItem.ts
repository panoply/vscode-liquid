import { Command, languages, LanguageStatusItem, LanguageStatusSeverity } from 'vscode';
import { Providers } from '../providers';

/**
 * Language Status Item
 *
 * Handler from the in~language status bar item.
 *
 * ---
 *
 * The `OutputChannel` class will extend next.
 */
export class StatusLanguageItem extends Providers {

  /**
   * Language Items
   *
   * Set reference of known language items
   */
  private languageItems: Set<LanguageStatusItem> = new Set();

  /**
   * Language Disposal
   *
   * Dispose of known Language Status Items
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
   *
   * Asserts a Language Status Item Error
   */
  public languageError (message: string, command?: Command) {

    const error = languages.createLanguageStatusItem('Liquid Errors', this.selector);

    error.severity = LanguageStatusSeverity.Error;
    error.text = message;

    if (command) error.command = command;

    this.languageItems.add(error);

  }

}
