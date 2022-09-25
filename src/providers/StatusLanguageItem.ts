import { Command, languages, LanguageStatusItem, LanguageStatusSeverity } from 'vscode';
import { State } from 'state';

export class StatusLanguageItem extends State {

  items: Set<LanguageStatusItem> = new Set();

  /**
   * Dispose Language Status Items
   */
  dispose () {
    if (this.items.size > 0) {
      for (const item of this.items) {
        item.dispose();
      }
    }
  }

  configFile (config: string, command?: Command) {

    const status = languages.createLanguageStatusItem('Liquid Language', this.liquidSelectors);
    status.severity = LanguageStatusSeverity.Information;
    status.text = config;

    if (command) status.command = command;

    return status;

  }

  configWarning (message: string, command?: Command) {

    const warning = languages.createLanguageStatusItem('Liquid Warning', this.liquidSelectors);
    warning.severity = LanguageStatusSeverity.Warning;
    warning.text = message;

    if (command) warning.command = command;

    this.items.add(warning);

  }

  configError (message: string, command?: Command) {

    const error = languages.createLanguageStatusItem('Liquid Errors', this.liquidSelectors);
    error.severity = LanguageStatusSeverity.Error;
    error.text = message;

    if (command) error.command = command;

    this.items.add(error);

  }

}
