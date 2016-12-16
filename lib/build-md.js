'use strict';

/* inspired by/copied from lodash - https://lodash.com */

const Promise = require('bluebird');

const docdown = require('docdown');
const fs = Promise.promisifyAll(require('fs-extra'));
const path = require('path');
const os = require('os');

const basePath = path.join(__dirname, '..');
const docsPath = path.join(basePath, 'docs');
const readmePath = path.join(docsPath, 'README.md');

const pkg = require('../package.json');
const version = pkg.version;

const config = {
  path: path.join('docs/replaced', 'itbl.js'),
  title: `<a href="https://harrysarson.github.io/itbl">itbl</a> <span>v${ version }</span>`,
  toc: 'categories',
  url: `https://github.com/harrysarson/itbl/blob/v${ version }/itbl.js`,

  style: 'github',
  sublinks: [npmLink('&#x24C3;', 'See the npm package')],
};

/**
 * Composes a npm link from `text` and optional `title`.
 *
 * @private
 * @param {string} text The link text.
 * @param {string} [title] The link title.
 * @returns {string} Returns the composed npm link.
 */
function npmLink(text, title) {
  return (
    '<% if (name == "templateSettings" || !/^(?:methods|properties|seq)$/i.test(category)) {' +
    'print(' +
    '"[' + text + '](https://www.npmjs.com/package/itbl." + name.toLowerCase() + ' +
    '"' + (title == null ? '' : ' \\"' + title + '\\"') + ')"' +
    ');' +
    '} %>'
  );
}

/**
 * Post-process `markdown` to make adjustments.
 *
 * @private
 * @param {string} markdown The markdown to process.
 * @returns {string} Returns the processed markdown.
 */
function postprocess(markdown) {
  return markdown
  // Wrap symbol property identifiers in brackets.
    .replace(/__symbol_iterator/g, '[Symbol.iterator]')
    .replace(/\.(Symbol\.(?:[a-z]+[A-Z]?)+)/g, '[$1]')
    // Remove <br> tags from code
    .replace(
      /```(\S*)?([\s\S]*?)```/g,
      (match, type, code) =>
      '```' +
      type +
      '\n' +
      code
        .replace(/<br>\s*<br>/g, '')
        .trim() +
      '\n' +
      '```'
    )
    // Convert line endings back to OS default
    .replace('\n', os.EOL);
}


const markdown = docdown(config);

fs.writeFileAsync(readmePath, postprocess(markdown))
  .catch(console.error);
