# Change Log

All notable changes are listed below.

> Documentation of the Change log started at version 0.3.1. All version prior 0.3.1 were beta variations.

## [2.1.1] – <small>03/07/2019</small>

### Changes

- Fixes Typo in `JSON` language default configuration
- Minor improvement on documentation

## [2.1.0] – <small>03/07/2019</small>

### Changes

- Fixes Tag Association implementation. Tag associations were removing enforced tag formats, this version fixes this new integration.

## [2.0.3] – <small>03/07/2019</small>

### Changes

- Expose and enforce `false` on the `unformatted` rule which sorts tag attributes in html and have their insides preserved. This is a HTML rule item.

## [2.0.2] – <small>03/07/2019</small>

### Changes

- Enforce `false` on for HTML language formatting tag sorting

## [2.0.1] – <small>03/07/2019</small>

Minor fix upon release of v2.0.0

### Changes

- Removed the deprecations helper, no need for this.

## [2.0.0] – <small>03/07/2019</small>

Version 2.0.0 was a complete overhaul of the extension. Some breaking changes were applied and a new approach to grammars and formatting was implemented.

### Added

- Rules can now use a `.liquidrc` JSON file to define code style formatting rules
- Errors will be published to output along with PrettyDiff parser errors.
- Support for `.ts` and `.jsx` files
- You can now associate tags to a formatting language rule

### Changed

- Grammar is now used as an injection, no longer overwriting languages.
- Configuration rules now use `liquid.rules` opposed to `liquid.beautify`.
- Deprecated `liquid.formatIgnore` in favor of using an `ignore` property in the `liquid.rules` setting object.
- New apporach to formatting and changed the way the extension works.

## [1.8.3] – <small>17/06/2019</small>

- Support Shopify section `schema` settings snippets

## [1.8.2] – <small>17/06/2019</small>

- Support `liquid` template literal

## [1.8.0] – <small>17/06/2019</small>

- Support `Markdown` files (.md)
- Various syntax fixez for `SCSS`, `CSS` and `JS` Syntax support
- Add `braces` rule in shopify sections `schema` block
- Expose the `correct` rule for HTML Formtting.

## [1.7.5] – <small>17/06/2019</small>

- Support `CSS` (.css.liquid) files and syntax

## [1.7.4] – <small>17/06/2019</small>

- Fix `=` entity other attribute name syntax highlighting issue

## [1.7.3] – <small>17/06/2019</small>

- Fixed semi-colon in schema tags

## [1.7.2] – <small>17/06/2019</small>

- Updated PrettyDiff Version
- Added `brace_block` formatting rule which allows newlines to be placed before and after shopify section blocks.
- Fixed `{% style %}` formatting. Formatting rules inherit those set within `stylesheet`.

## [1.7.1] – <small>16/06/2019</small>

- Added Folding marker integration

## [1.7.0] – <small>16/06/2019</small>

- Complete overhaul on syntax definitions.
- Support syntax highlighting for SCSS Liquid `.scss.liquid` files
- Support syntax highlighting for JavaScript Liquid `.js.liquid` files
- Support syntax highlighting within `<script>` tags

## [1.6.5] – <small>10/05/2019</small>

- Minor overhaul on syntax definitions, leverages variable tags.
- Fixes Shopfy `{% javascript %}` and `{% schema %}` syntax highlighting.
- Make new literal string highlighting injection more sane
- Format tmLanguage, bring sanity to the ever growing file.

## [1.6.4] – <small>08/05/2019</small>

- Added support for literal string injection syntax highlighting, applying liquid syntax to HTML tag attributes inject highlights, partial close for https://github.com/panoply/vscode-liquid/issues/10.

## [1.6.3] – <small>26/04/2019</small>

- Revert and re-open https://github.com/panoply/vscode-liquid/issues/7 comment tags formatting issue caused by PrettyDiff. Issue still not resolved within the PrettyDiff Sparser.
- Updated readme to include the specifics regarding enforced ignore tags.

## [1.6.2] – <small>25/04/2019</small>

- Fixes https://github.com/panoply/vscode-liquid/issues/7 comment tags formatting issue caused by PrettyDiff.

## [1.6.1] – <small>22/04/2019</small>

- Added default support for `.jekyll` extension files.
- Added Frontmatter snippet, enabled when doublde dash is detected, eg: `--`
- Accepts any word following underscore case for `{% include_* %}` tags. This is to help with plugins like Jekyll Cached which will use `{% include_cached %}`.

## [1.6.0] – <small>14/04/2019</small>

- Exposed ignore tags option to configuration settings. Allows for tags to be ignored when formatting.
- Various bug fixes
- Better Documentation

## [1.5.4] – <small>13/04/2019</small>

- Fixed `{% include %}` tag syntax highlighting when using with Jekyll.
- Added attribute syntax highlighting, any `attr="tag"` code occurances in liquid tags.
- Adjusted test files to make more sense.

## [1.5.3] – <small>12/04/2019</small>

- Added `block` and `item` to support syntax class

## [1.5.1] – <small>12/04/2019</small>

- Fix disable
- Add status bar icon

## [1.5.0] – <small>12/04/2019</small>

Various fixes, modifications and updates in this version. The extension is now leveraging classes and source was re-wrote.

- Added
  - `---` frontmatter to configurations
  - Schema blocks to folding markers
  - Ignore frontmatter Jekyll when formatting
  - Keybinding of `cmd + shift + l` can be used
- Changes
  - Rewrote source files
  - Updated readme.
  - Disabled extensions in development host

## [1.4.1] – <small>07/04/2019</small>

- Updated readme
- Changed name to simply "Liquid"

## [1.4.0] – <small>07/04/2019</small>

This version will support formatting by default for any files using a `.html`, `*.html` or `.liquid` extension when the `liquid.format` setting is set to `true`.

Extension Changes:

- Changed extension display name from "Shopify Liquid" to just "Liquid" as the extension now supports Jekyll and basically all Liquid variations.

Added Jekyll Support:

- Jekyll Frontmatter
- Jekyll objects like `{{ page }}` and `{{ jekyll }}`

Fixed Formatting issues:

- Fixed enable/disable
- Code adjustments

## [1.2.0] - [1.3.3] – <small>03/2019</small>

Various Bug fixes

## [1.2.0] – <small>10/03/2019</small>

Additional fixes and ES6 development environment.

### Changed

- Use backup editor configuration for tab size
- Upgraded to extension code to ES6
- Switched air-bnb eslint for standard

### Added

- Exposed options of [PrettyDiff](http://prettydiff.com) for each code block.
- Beautify on save will be enabled when "editor.formatOnSave" is `true` – Which means you can use the Formatting Toggle extension to enable and disable liquid formatting.

## [1.1.0] – <small>10/03/2019</small>

Fixes various bugs and the extension now allows

### Added

- Exposed options of [PrettyDiff](http://prettydiff.com) for each code block.
- Beautify on save will be enabled when "editor.formatOnSave" is `true` – Which means you can use the Formatting Toggle extension to enable and disable liquid formatting.

## [1.0.0] – <small>7/3/2019</small>

Version 1.0.0 is a complete overhaul.

The extension now supports liquid formatting. Single file section were removed and will be supported in a seperate extension.

> Additionally, several development dependencies were added to better handle development workflow.

### Added

- Formatting support added in using [PrettyDiff](http://prettydiff.com).

### Changed

- Single File Sections support was removed.
- Removed Single File Section snippets
- Directory re-structure
- Updated README.md file.

## [0.5.0] – <small>27/2/2019</small>

This version now supports HTML intellisense within `.liquid` files. This comes at the expense of Liquid snippets being applied when working with `.html`files.

This extension now works to extended upon the HTML language where in previous versions it worked more as its own langauge.

### Added

- Additional `.html.liquid` extension support.

### Changed

- Language name, was `Shopify Liquid (HTML)` now is `HTML`
- Removed bracket
- Eliminated the need to implement Emmet in user configuration.
- Removed Usage from documentation.

### Minor Bug

- SCSS stylesheet complains of incorrect syntax

## [0.4.2] – <small>16/2/2019</small>

### Added

- Support for `{% style %}{% endstyle %}` tags added.

### Changed

- Re-write liquid matchers.

## [0.4.1] – <small>7/2/2019</small>

This release supports `@schema('*')` tag imports for Single File Sections. Snippets now support Single File section HTML tags and various logic re-works.

### Added

- import schema tag `@schema('*')`
- snippet helpers for single file sections.
- Tests for new schema import
- Added deeper level snippet for `{% schema %}` liquid tag.
- Added additional information in readme about Single File Sections.

### Changed

- Included import tags within readme file along with some minor edits.
- Fixed placeholder number for liquid stylesheet and javascript tag
- Prefixed liquid sections snippets from "Tag" to "Liquid Tag" to avoid confusion with single file section snippet helpers.

## [0.4.0] – <small>5/2/2019</small>

This version now supports snippets forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets). Prior to this release using [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) required an external dependency.

_If you're using the [vscode-liquid](https://github.com/GingerBear/vscode-liquid) or [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) extensions then it's safe to remove them as this release now support both syntax and snippets._

### Added

- Forked [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) and added snippet support.
- Added HTML support usage to readme

### Changed

- Adjusted format of readme
- Reverted `<` and `>` from configuration to avoid conflicts.

## [0.3.1] – <small>2/2/2019</small>

Injection single file section tags now support dash `-` string matches.

### Added

- Additional Regex match
- Added change log.

### Changed

- Modified readme.md file name.
- Updated `single-file-sections.js` test file.
