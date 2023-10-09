import { has } from 'rambdax';
import { basename } from 'node:path';
import { SchemaBlocks, SchemaSettings, SharedSchema } from 'types';
import { isArray, isObject } from 'utils';
import { MarkdownString, Uri } from 'vscode';
import { JSONSchema } from 'vscode-json-languageservice';

/**
 * Shared Schema
 */
export function getSharedSchema (uri: Uri, data: SharedSchema, schema: JSONSchema): JSONSchema {

  if (!has('properties', schema.definitions.shared_settings)) {

    schema.definitions.shared_settings = {
      type: 'object',
      markdownDescription: [
        '**Shared Schema Sections (Settings)**',
        '',
        'Inject a [syncify](https://github.com/panoply/syncify) shared schema reference (`$ref`).'
      ].join('\n'),
      properties: {
        $ref: {
          anyOf: []
        }
      }
    };
  }

  if (!has('properties', schema.definitions.shared_blocks)) {

    schema.definitions.shared_blocks = {
      type: 'object',
      markdownDescription: [
        '**Shared Schema Sections (Blocks)**',
        '',
        'Inject a [syncify](https://github.com/panoply/syncify) shared schema reference (`$ref`).'
      ].join('\n'),
      properties: {
        $ref: {
          anyOf: []
        }
      }
    };
  }

  const $ref: {
    settings: {
      $comment: string;
      type: string;
      enum: string[];
      markdownEnumDescriptions: string[];
    },
    blocks: {
      $comment: string;
      type: string;
      enum: string[];
      markdownEnumDescriptions: string[];
    }
  } = {
    blocks: {
      $comment: uri.fsPath,
      type: 'string',
      enum: [],
      markdownEnumDescriptions: []
    },
    settings: {
      $comment: uri.fsPath,
      type: 'string',
      enum: [],
      markdownEnumDescriptions: []
    }
  };

  const filename = basename(uri.fsPath, '.schema');

  if (data === null) {

    const settings = schema.definitions.shared_settings.properties.$ref as { anyOf: typeof $ref.settings[] };
    const settingsIndex = settings.anyOf.findIndex(({ $comment }) => $comment === uri.fsPath);

    if (settingsIndex > -1) settings.anyOf.splice(settingsIndex, 1);

    const blocks = schema.definitions.shared_blocks.properties.$ref as { anyOf: typeof $ref.blocks[] };
    const blocksIndex = blocks.anyOf.findIndex(({ $comment }) => $comment === uri.fsPath);

    if (blocksIndex > -1) blocks.anyOf.splice(blocksIndex, 1);

    return schema;

  }

  for (const prop in data) {

    if (prop === '$schema' || prop === '$description') continue;

    /**
     * The $ref entry property
     */
    const name = `${filename}.${prop}`;

    /**
     * The structure type
     */
    const md = new MarkdownString();

    /**
     * The defintion type to inject within
     */
    let type: 'blocks' | 'settings';

    if (isArray<Array<SchemaSettings | SchemaBlocks>>(data[prop])) {

      // Block Spread
      //
      if (has('settings', data[prop][0])) {

        type = 'blocks';

        md.appendMarkdown('**Block Spread**\n\n')
          .appendMarkdown('This `$ref` contains a list of block settings available for section `blocks[]`')
          .appendMarkdown('\n\n---\n');

      } else {

        type = 'settings';

        md.appendMarkdown('**Setting Spread**\n\n')
          .appendMarkdown('This `$ref` contains a list of input settings available to `settings[]` or `blocks[]`')
          .appendMarkdown('\n\n---\n');
      }

      if (has('$description', data[prop][0])) {
        if (isArray(data[prop][0].$description)) {
          md.appendMarkdown(data[prop][0].$description.join('\n') + '\n');
        } else {
          md.appendMarkdown(data[prop][0].$description + '\n');
        }
      }

    } else if (isObject(data[prop])) {

      if (has('settings', data[prop])) {

        if (has('type', data[prop]) && has('name', data[prop])) {

          type = 'blocks';

          md.appendMarkdown('**Block Singleton**\n\n')
            .appendMarkdown('This `$ref` contains a single block settings available to section `blocks[]`')
            .appendMarkdown('\n\n---\n');
        } else {

          type = 'settings';

          md.appendMarkdown('**Setting Group**\n\n')
            .appendMarkdown('This `$ref` contains a settings group available for `settings[]`')
            .appendMarkdown('\n\n---\n');
        }
      } else {

        type = 'settings';

        md.appendMarkdown('**Setting Singleton**\n\n')
          .appendMarkdown('This `$ref` contains a single input setting available to `settings[]`')
          .appendMarkdown('\n\n---\n');
      }

      if (has('$description', data[prop])) {
        // @ts-ignore
        if (isArray(data[prop].$description)) {

          // @ts-ignore
          md.appendMarkdown(data[prop].$description.join('\n') + '\n');
        } else {

          // @ts-ignore
          md.appendMarkdown(data[prop].$description + '\n');
        }
      }
    }

    md.appendMarkdown(`\n[${filename}.schema](./${filename}.schema)`);
    md.baseUri = uri;

    $ref[type].enum.push(name);
    $ref[type].markdownEnumDescriptions.push(md.value);

  }

  if ($ref.settings.enum.length > 0) {

    const settings = schema.definitions.shared_settings.properties.$ref as { anyOf: typeof $ref.settings[] };
    const index = settings.anyOf.findIndex(({ $comment }) => $comment === uri.fsPath);

    if (index > -1) {
      settings.anyOf[index] = $ref.settings;
    } else {
      settings.anyOf.push($ref.settings);
    }
  }

  if ($ref.blocks.enum.length > 0) {

    const blocks = schema.definitions.shared_blocks.properties.$ref as { anyOf: typeof $ref.blocks[] };
    const index = blocks.anyOf.findIndex(({ $comment }) => $comment === uri.fsPath);

    if (index > -1) {
      blocks.anyOf[index] = $ref.blocks;
    } else {
      blocks.anyOf.push($ref.blocks);
    }
  }

  return schema;

}
