# Change Log

All notable changes are listed below.

> Documentation of the Change log started at version 0.3.1. All version prior 0.3.1 were beta variations.

## [1.0.0] – <small>10/03/2019</small>

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
