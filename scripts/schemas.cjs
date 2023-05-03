const { join } = require('node:path');
const { writeFileSync } = require('node:fs');
const cwd = process.cwd();
const { log } = console;

const schema = join(cwd, 'schema');

const liquidrc = require('../node_modules/@liquify/schema/liquidrc.json');
writeFileSync(join(schema, 'liquidrc.json'), JSON.stringify(liquidrc));
log('schema/liquidrc.json');

const locales = require('../node_modules/@liquify/schema/shopify/locales.json');
writeFileSync(join(schema, 'shopify-locales.json'), JSON.stringify(locales));
log('schema/shopify-locales.json');

const settings_data = require('../node_modules/@liquify/schema/shopify/settings_data.json');
writeFileSync(join(schema, 'shopify-settings.json'), JSON.stringify(settings_data));
log('schema/shopify-settings.json');

const templates = require('../node_modules/@liquify/schema/shopify/templates.json');
writeFileSync(join(schema, 'shopify-templates.json'), JSON.stringify(templates));
log('schema/shopify-templates.json');

const pkg = require('../package.json');
const config = require('../node_modules/@liquify/schema/vscode/configuration.json');

delete config.$schema;

pkg.contributes.configuration = require('../node_modules/@liquify/schema/vscode/configuration.json');

const updated = JSON.stringify(pkg, null, 2);

writeFileSync(join(cwd, 'package.json'), updated);
log('updated vscode configuration');

const store = [
  '/**',
  '* LICENSE',
  '*',
  '* THIS LICENCE IS STRICTLY IMPOSED',
  '* YOU ARE NOT PERMITTED TO USE THE CONTENTS OF THIS FILE IN ANY FORM',
  '* YOUR ARE NOT AUTHORISED TO COPY, RE-DISTRIBUTE OR MODIFY THE CONTENTS OF THIS FILE',
  '* YOU MUST FIRST ASK PERMISSION FROM THE PROJECT AUTHOR BEFORE USAGE OR RE-PURPOSING OF ANY KIND',
  '*',
  '*/',
  '',
  '/* eslint-disable */',
  `export const schema = ${JSON.stringify(require('../node_modules/@liquify/schema/shopify/sections.json'))}`
].join('\n');

writeFileSync(join(cwd, 'extension/data/store.ts'), store);
log('copied sections schema to extension/data');
