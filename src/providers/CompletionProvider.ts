import { getSectionCompletions, getSectionScope } from '../parse/sections';
import { JSONLanguageService } from 'service/JsonLanguageService';
import { Char, Token } from 'parse/enums';
import { EmptyTag, EmptyOutput } from 'parse/regex';
import {
  parseToken,
  prevChar,
  parseObject,
  parseSchema,
  typeToken,
  getSchemaCompletions
} from 'parse/tokens';

import {
  CompletionItem,
  CompletionTriggerKind,
  TextDocument,
  Position,
  CancellationToken,
  TextEdit
} from 'vscode';

import { Completions, Workspace } from 'types';

/**
 * Completion Provider
 *
 * This provides some basic completions. I have extracted some
 * logic from Liquify to make this possible as I feel as if I owe
 * users something worthwhile having them wait so f*cking long.
 *
 * Most of this will be purged and move to the Language Server
 * when Liquify supersedes. It is a shame because the specs can
 * do so much more in the grand scale and folks wont get to see that
 * until Liquify is made available.
 */
export function CompletionProvider (
  canComplete: Workspace.Completion,
  complete: Completions,
  service: JSONLanguageService
) {

  let additionalTextEdits: TextEdit[];

  return {

    /**
     * Resolve Completion Item
     *
     * The completion item resolver. In some situations
     * we need to apply additional text edits before resolving,
     * it's here we provide this logic.
     */
    resolveCompletionItem (item: CompletionItem) {

      if (additionalTextEdits) item.additionalTextEdits = additionalTextEdits;

      return item;

    },

    async provideCompletionItems (
      document: TextDocument,
      position: Position,
      _: CancellationToken,
      { triggerCharacter, triggerKind }
    ) {

      const trigger = CompletionTriggerKind.TriggerCharacter === triggerKind
        ? triggerCharacter.charCodeAt(0)
        : false;

      const content = document.getText();
      const offset = document.offsetAt(position);

      additionalTextEdits = null;

      if (trigger === Char.DQO || trigger === Char.COL) {

        const isSchema = parseSchema(content, offset);

        if (isSchema !== false && isSchema.within) {

          const schema = service.doParse(document, position, isSchema);
          const items = await service.doCompletions(schema);

          return getSchemaCompletions(
            trigger === Char.DQO ? 1 : 0,
            position.line,
            position.character,
            items as any
          );

        }

      }

      if (trigger === Char.PER) {

        if (!canComplete.tags) return null;

        const character = position.character - (trigger === Char.WSP ? 3 : 1);

        additionalTextEdits = [ TextEdit.insert(new Position(position.line, character), '{') ];

        return complete.tags;

      }

      const type = typeToken(content, offset);

      if (type === Token.Object) {

        const object = parseToken(Token.Object, content, offset);

        if (object.within) {

          if (EmptyOutput.test(object.text) && canComplete.objects) return complete.objects;

          const prev = prevChar(object.text, object.offset);

          if (trigger === Char.PIP || prev === Token.Filter) {

            return canComplete.filters
              ? complete.filters
              : null;

          }

          if (trigger === Char.DOT || prev === Token.Property || prev === Token.Block) {

            const schema = canComplete.objects
              ? parseObject(object.text, object.offset)
              : null;

            if (schema !== null && canComplete.section) {
              if (schema === 'settings') {

                return getSectionCompletions(content, offset, schema);

              } else if (schema === 'block') {

                const type = getSectionScope(content, offset);

                if (type !== null) {

                  return getSectionCompletions(content, offset, schema, type);

                }
              }
            }

            return schema;

          }

          if (trigger === Char.COL || prev === Token.Object) {

            return canComplete.objects
              ? complete.objects
              : null;

          }

          return null;

        }

      } else if (type === Token.Tag) {

        const tag = parseToken(Token.Tag, content, offset);

        if (tag.within) {

          if (EmptyTag.test(tag.text) && canComplete.tags) return complete.tags;

          const prev = prevChar(tag.text, tag.offset, tag.tagName);

          if (prev === Token.Block) {

            if (trigger === Char.DQO || trigger === Char.SQO) {

              return getSectionCompletions(content, offset, 'type');

            } else {

              return getSectionCompletions(content, offset, 'type', 'string');

            }
          }

          if (trigger === Char.PIP || prev === Token.Filter) {

            return canComplete.filters
              ? complete.filters
              : null;

          }

          if (trigger === Char.DOT || prev === Token.Property) {

            const schema = canComplete.objects
              ? parseObject(tag.text, tag.offset)
              : null;

            if (schema !== null && canComplete.section) {
              if (schema === 'settings') {

                return getSectionCompletions(content, offset, schema);

              } else if (schema === 'block') {

                const type = getSectionScope(content, offset);

                if (type !== null) {

                  return getSectionCompletions(content, offset, schema, type);

                }
              }
            }

            return schema;

          }

          if (trigger === Char.COL || prev === Token.Object) {

            return canComplete.objects
              ? complete.common
              : null;

          }

          if (prev === Token.Logical && canComplete.logical) {
            return complete.logical;
          }

          return null;
        }

      }
    }
  };

}
