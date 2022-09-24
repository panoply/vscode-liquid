import { Command, languages, LanguageStatusItem, LanguageStatusSeverity } from 'vscode';

export class StatusLanguageItem {

  private extendedSelectors = [
    {
      language: 'html',
      scheme: 'file'
    },
    {
      language: 'css',
      scheme: 'file'
    },
    {
      language: 'javascript',
      scheme: 'file'
    }

  ];

  private liquidSelectors = [
    {
      language: 'liquid',
      scheme: 'file'
    },
    {
      language: 'liquid-css',
      scheme: 'file'
    },
    {
      language: 'liquid-scss',
      scheme: 'file'
    },
    {
      language: 'liquid-javascript',
      scheme: 'file'
    }
  ];

  items: Set<LanguageStatusItem> = new Set();

  dispose () {
    if (this.items.size > 0) {
      for (const item of this.items) {
        item.dispose();
      }
    }
  }

  status (config: string, command?: Command) {

    const status = languages.createLanguageStatusItem('Liquid Language', this.liquidSelectors);
    status.severity = LanguageStatusSeverity.Information;
    status.text = config;

    if (command) status.command = command;

    return status;

  }

  extended (message: string, command?: Command) {

    const extend = languages.createLanguageStatusItem('Prettify', this.extendedSelectors);
    extend.severity = LanguageStatusSeverity.Information;
    extend.text = message;
    extend.detail = 'Formatting using Prettify';

    if (command) extend.command = command;

    this.items.add(extend);

  }

  warning (message: string, command?: Command) {

    const warning = languages.createLanguageStatusItem('Liquid Warning', this.liquidSelectors);
    warning.severity = LanguageStatusSeverity.Warning;
    warning.text = message;

    if (command) warning.command = command;

    this.items.add(warning);

  }

  error (message: string, command?: Command) {

    const error = languages.createLanguageStatusItem('Liquid Errors', this.liquidSelectors);
    error.severity = LanguageStatusSeverity.Error;
    error.text = message;

    if (command) error.command = command;

    this.items.add(error);

  }

}
