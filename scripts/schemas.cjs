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

const settings_schema = require('../node_modules/@liquify/schema/shopify/settings_schema.json');
writeFileSync(join(schema, 'shopify-schema.json'), JSON.stringify(settings_schema));
log('schema/shopify-schema.json');

const templates = require('../node_modules/@liquify/schema/shopify/templates.json');
writeFileSync(join(schema, 'shopify-templates.json'), JSON.stringify(templates));
log('schema/shopify-templates.json');

const section_groups = require('../node_modules/@liquify/schema/shopify/section-groups.json');
writeFileSync(join(schema, 'section-groups.json'), JSON.stringify(section_groups));
log('schema/section-groups.json');

const syncify = require('../node_modules/@liquify/schema/syncify.json');
writeFileSync(join(schema, 'syncify.json'), JSON.stringify(syncify));
log('schema/syncify.json');

const syncify_pkg = require('../node_modules/@liquify/schema/syncify/package-json.json');
writeFileSync(join(schema, 'syncify-pkg.json'), JSON.stringify(syncify_pkg));
log('schema/syncify-pkg.json');

const syncify_sections = require('../node_modules/@liquify/schema/syncify/shared-schema.json');
writeFileSync(join(schema, 'syncify-schema.json'), JSON.stringify(syncify_sections));
log('schema/shared-schema.json');

const syncify_env = require('../node_modules/@liquify/schema/syncify/env.json');
writeFileSync(join(schema, 'syncify-env.json'), JSON.stringify(syncify_env));
log('schema/syncify-env.json');

const pkg = require('../package.json');
const config = require('../node_modules/@liquify/schema/vscode/configuration.json');

delete config.$schema;

pkg.contributes.configuration = require('../node_modules/@liquify/schema/vscode/configuration.json');

const updated = JSON.stringify(pkg, null, 2);

writeFileSync(join(cwd, 'package.json'), updated);
log('updated vscode configuration');

const store = [
  '/**',
  '* LICENSE - THIS FILE IS NOT MIT',
  '*',
  '* THIS LICENCE IS STRICTLY IMPOSED AND IS LIMITED TO APPROVED USAGE',
  '* YOU ARE NOT PERMITTED TO USE THE CONTENTS OF THIS FILE IN ANY FORM',
  '* YOUR ARE NOT AUTHORISED TO COPY, RE-DISTRIBUTE OR MODIFY THIS FILE',
  '* ASK PERMISSION FROM THE PROJECT AUTHOR BEFORE USAGE OR RE-PURPOSING',
  '*',
  '*/',
  '/* eslint-disable */',
  `export const schema = ${JSON.stringify(require('../node_modules/@liquify/schema/shopify/sections.json'), null, 2)}`
].join('\n');

writeFileSync(join(cwd, 'extension/data/store.ts'), store);
log('copied sections schema to extension/data');
