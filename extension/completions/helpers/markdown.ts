import { has } from 'rambdax';
import { MarkdownString } from 'vscode';

/**
 * Markdown Link
 *
 * Returns a markdown link prepended with 2 newlines
 */
export function link (name: string, url: string) {

  return `\n\n[${name}](${url})`;
}

/**
 * Markdown String
 *
 * Returns an instance of `Markdown` to be rendered.
 */
export function string (description: string, reference?: {
  name: string;
  url: string;
}) {

  const md = new MarkdownString();

  md.supportThemeIcons = true;
  md.supportHtml = true;
  md.appendMarkdown(description);

  if (
    reference &&
    has('name', reference) &&
    has('url', reference)) md.appendMarkdown(link(reference.name, reference.url));

  return md;

}

/**
 * Markdown String
 *
 * Returns an instance of `Markdown` to be rendered.
 */
export function lines (title: string, description: string, url: string) {

  const md = new MarkdownString();

  md.supportThemeIcons = true;
  md.supportHtml = true;
  md.appendMarkdown(title + '\n\n' + description + '\n\n' + url);

  return md;

}
