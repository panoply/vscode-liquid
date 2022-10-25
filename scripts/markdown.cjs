const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const cwd = process.cwd();

/* -------------------------------------------- */
/* SCHEMA FILES                                 */
/* -------------------------------------------- */

/**
 * Package JSON File
 */
const pkgjson = require(join(cwd, 'package.json'));

/**
 * Liquidrc Schema File
 */
const liquidrc = require(join(cwd, 'schema', 'liquidrc.json'));
