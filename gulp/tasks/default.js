/*
 * Set the default gulp command to development -> watch.
 *
 */
 var gulp = require('gulp'),
  gutil   = require('gulp-util');

// build yaml file and watch files.
gulp.task('default', [
  'set-env-dev',
  'iconfonts',
  'sass',  
  'fileinclude',
  'watch',
  'webpack-dev-server'
], function() {

});

