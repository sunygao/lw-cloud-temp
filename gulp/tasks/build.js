/*
 * Gulp commands for building the project
 * Specifically just managing the r.js optimizer and configuration.
 * gulp will run an npm script
 */

var gulp    = require('gulp'),
  gutil     = require('gulp-util'),
  config    = require('../config.json'),
  runSequence = require('run-sequence');


gulp.task('build', function(callback) {
  runSequence('set-env-prod',
              'clean',
              'iconfonts',
              'fileinclude',
              'copyStaticFiles',
              ['sass', 'webpack'],
              callback);
});
