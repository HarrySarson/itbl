'use strict';

const _ = require('lodash');
const docdown = require('docdown');
const gutil = require('gulp-util');
const path = require('path');
const through2 = require('through2');

const pkg = require('../package.json');
const version = pkg.version;

const config = {
  'base': {
    'title': `<a href="http://harrysarson.magic.net/">Harry Sarson</a> <span>v${ version }</span>`,
    'toc': 'categories',
    'url': `https://github.com/HarrySarson/itbl/blob/${ version }/itbl.js`
  },
  'github': {
    'style': 'github',
    'sublinks': [npmLink('&#x24C3;', 'See the npm package')]
  },
  /*
  'site': {
    'entryLink': '<a href="${entryHref}" class="fa fa-link"></a>',
    'sourceLink': '[source](${sourceHref})',
    'tocHref': '',
    'tocLink': '',
    'sublinks': [npmLink('npm package')]
  }
  */
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
  // Wrap symbol property identifiers in brackets.
  return markdown.replace(/\.(Symbol\.(?:[a-z]+[A-Z]?)+)/g, '[$1]');
}

/*----------------------------------------------------------------------------*/

/**
 * Returns transform stream to create the documentation markdown.
 *
 * @param {string} type The format type.
 */
module.exports = function(options) {
  
  options = options || {};
  
  return through2.obj(function(file, enc, cb) {
    
    // we only care about file.path
    // therefore this works if file.contents is null, stream or buffer
    
    
    let newFile = null,
        er = null;
    
    try {
      newFile = new gutil.File({
        cwd: '',
        base: '',
        path: 'readme.md',
        contents: Buffer.from(
          postprocess(
            docdown(
              _.defaults({
                  path: file.path
                }, 
                options, 
                config.base, 
                config.github
              )
            )
          )
        ),
      });
    } catch(e) {
      er = e;
    }
        
    cb(er, newFile);
  });

}

