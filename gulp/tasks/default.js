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
  'sass',  // this gets run by watch asap.
  'watch',
  'webpack-dev-server'
], function() {

});

