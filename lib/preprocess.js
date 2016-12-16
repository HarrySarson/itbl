'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const config = require('../.jsdoc.json');

async function replacer() {

  let data = await fs.readFileAsync('itbl.js', 'utf8');

  let replaced = data
    .replace(/\[Symbol\.iterator\]/g, '__symbol_iterator')
  ;

  try {
    await fs.mkdirAsync(path.join(config.opts.destination, 'replaced'));
  } catch(err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  return await fs.writeFileAsync(path.join(config.opts.destination, 'replaced/itbl.js'), replaced, 'utf8');
}

module.exports = replacer()
  .catch(error => {
    console.error('Error occurred:', error);
  })
;
