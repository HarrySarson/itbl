const
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  runseq = require('run-sequence'),
  replace = require('gulp-replace'),
  through2 = require('through2'),
  umd = require('gulp-umd'),
  buildDist = require('./build-dist'),
  buildDocs = require('./build-docs');
  
// to do

// wrap in factory function           y
// check exports is correct           y
// make sure files end with \n        nah
// external requires                  half - for now just use global _ or require in node/browserify environments
//                                    will want to remove dependency on lodash eventually

// why does index have 'use strict';  don't know

// noconflict
// unit tests
// return iterator if input is iterator
// proper iterator closing

let strictmode = false 
  ? "'use strict';\n"
  : '';

gulp.task('build', function() {
  
  
  return gulp.src('./main.js', { base: '../'} )
    .pipe(buildDist({
      debug: false,
    }))
    // remove double blank lines
    .pipe(replace(/^(\s*?)(\r\n|\r|\n)\s*$/gm, '\n'))
    // remove blanks lines at beggining of file
    .pipe(replace(/^\s*/g, strictmode))
    .pipe(rename('itbl.js'))
    .pipe(umd({
      exports: file => 'itbl',
      namespace: file => 'itbl',
      dependencies: file => [{
        name: '_',
        amd: 'lodash',
        cjs: 'lodash',
        global: '_',
        param: '_',
      }]
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('../'));  
});

gulp.task('docs', function() {
  
  return gulp.src('../itbl.js', {
    read: false,
  })
    .pipe(buildDocs({}))
    .on('error', gutil.log)
    .pipe(gulp.dest('../docs/'));
});

gulp.task('default', function(cb) {
  runseq(
    'build',
    'docs',
    cb)
});
