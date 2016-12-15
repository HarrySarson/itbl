'use strict';

const replace = require('replace-in-file');
const options = {
 
  files: [
    'doc/**/*.html',
  ],
 
  replace: /@@iterator/g,
  with: '[Symbol.iterator]',
 
};



replace(options)
  .then(changedFiles => {
    console.log('Modified files:', changedFiles.join(', '));
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });