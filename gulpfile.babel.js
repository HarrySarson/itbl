const
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  build = require('./build-dist2');
  
  
gulp.task('build', function() {
  
  return gulp.src('./lib/index.js')
    .pipe(build().on('error', gutil.log))
    .on('error', gutil.log)
    .pipe(gulp.dest('./itbl'));  
});

gulp.task('default', ['build']);