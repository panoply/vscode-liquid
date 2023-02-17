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

  if (
    reference &&
    has('name', reference) &&
    has('url', reference)) {

    return new MarkdownString(description + link(reference.name, reference.url));

  }

  return new MarkdownString(description);

}

/**
 * Markdown String
 *
 * Returns an instance of `Markdown` to be rendered.
 */
export function lines (...description: [
  title: string,
  description: string,
  url: string
]) {

  if (
    reference &&
    has('name', reference) &&
    has('url', reference)) {

    return new MarkdownString(description + link(reference.name, reference.url));

  }

  return new MarkdownString(description);

}
