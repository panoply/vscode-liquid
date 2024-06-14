import { JSONLanguageProvider } from './services/JSONLanguageService';
import { DiagnosticProvider } from './providers/DiagnosticProvider';

/**
 * Providers
 *
 * Implements all known feature providers, including language services
 * like (for example) the JSONLanguageService. This is the base class
 * from which which all `workspace/*` classes will extend.
 *
 * ---
 *
 * The `StatusLanguageItem` class will extend next.
 */
export class Service {

  /**
   * JSON Language Provider
   *
   * The implemented JSON Language Service provider
   */
  public json = new JSONLanguageProvider();

  /**
   * Diagnostic Item Provider
   *
   * The diagnostics provider instance
   */
  public diagnostic = new DiagnosticProvider();

}
