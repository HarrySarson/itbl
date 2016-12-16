'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const glob = Promise.promisify(require('glob'));
const path = require('path');
const deletedir = require('./delete-dir');

const config = require('../.jsdoc.json');

async function replacer(file) {
  
  let data = await fs.readFileAsync(file, 'utf8');
  
  let replaced = data
    .replace(/__symbol_iterator/g, '[Symbol.iterator]') // revert Symbol properties into standard form
  ;
  
  return await fs.writeFileAsync(file, replaced, 'utf8');    
}


glob(config.opts.destination + '**/*.html')
  .then(files => Promise.all(files.map(replacer)))
    
  .catch(error => {
    console.error('Error occurred:', error);
  })
;