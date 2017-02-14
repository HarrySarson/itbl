'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const findup = require('find-up');


const config = require(findup.sync('.jsdoc.json'));

async function replacer() {

  await require('./preprocess');

  let data = await fs.readFileAsync(path.join(config.opts.destination, 'replaced/itbl.js'), 'utf8');

  let replaced = data
    .replace('<!-- replace for docdown -->', '') // get rid of the rubbish
  ;

  return await fs.writeFileAsync(path.join(config.opts.destination, 'replaced/itbl.js'), replaced, 'utf8');
}

module.exports = replacer()
  .catch(error => {
    console.error('Error occurred:', error);
  })
;
