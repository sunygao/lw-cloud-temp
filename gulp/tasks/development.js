/*
 * Gulp commands for development
 * 
 *
 *
 *
 */

var gulp  = require('gulp'),
	sass = require('gulp-sass'),
  webpack = require("webpack"),
  WebpackDevServer = require("webpack-dev-server"),
  webpackConfig = require("../../webpack.config.js"),
  iconfont = require('gulp-iconfont'),
  iconfontCss = require('gulp-iconfont-css'),
  gutil   = require('gulp-util'),
  path = require('path'),
	config  = require('../config.json'),
  plumber = require('gulp-plumber'),
  fontName = 'iconfont',
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  runSequence = require('run-sequence'),
  fileinclude = require('gulp-file-include'),
  markdown = require('markdown'),
  sourcemaps = require('gulp-sourcemaps');;

/*
 * Set environment to prod
 *
 */
gulp.task('set-env-prod', function() {
    return gutil.env = 'prod';
});

/*
 * Set environment to dev
 *
 */
gulp.task('set-env-dev', function() {
    return gutil.env = 'dev';
});

  
/*
 * Compile compass
 *
 */
gulp.task('sass', function() {
  var options = {
    includePaths: [
        path.resolve('node_modules/bootstrap-sass/assets/stylesheets')
     ]
  },
  cssPath;

  //dev config
  cssPath = config.development.css.path,
  options.outputStyle = 'expanded';
  
  // if for deployment
  if(gutil.env == 'prod') {
    cssPath = config.deploy.css.path,
    options.outputStyle = "compressed";
  }

  gulp.src(config.src.sass.files)
    .pipe( plumber())
    .pipe(sourcemaps.init())
    .pipe(sass(options).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
        browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 8",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6"
        ],
        cascade: false
    }))
    
    .pipe(gulp.dest(cssPath));
});

/*
 * Watch templates and compass/sass files.
 *
 */
gulp.task('watch', function() {
  gulp.watch(config.src.sass.files, ['sass']);
  gulp.watch(config.src.html.files, ['generateHtml']);

//  gulp.watch(config.src.js.files, ['webpack']);

  //gulp.watch(config.iconfont.srcSVG, ['iconfonts']);
});


/*
 * Icon Font generation
 * 
 */
gulp.task('iconfonts', function(){
  console.log('\n----- iconfonts ---- ');
    var fontPath = config.iconfont.fontPath;

    return gulp.src(config.iconfont.srcSVG)
      .pipe( plumber())
      .pipe(iconfontCss({
        fontName: fontName,
        path: config.iconfont.cssTempSrc,
        targetPath: config.iconfont.sassDest,
        fontPath: fontPath
      }))
      .pipe(iconfont({
        fontName: fontName,
        normalize: true,
        appendCodepoints: true
       }))
      .pipe(gulp.dest(config.iconfont.destFontPath))
});

 // Start a webpack-dev-server
gulp.task('webpack-dev-server', function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;

 
  new WebpackDevServer(webpack(myConfig), 
    myConfig.devServer
  ).listen(8080, '0.0.0.0', function(err) {

  });
});

/*
 * Compile js using webpack
 *
 */
gulp.task("webpack", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
 
  if( gutil.env == 'prod' ){
    myConfig.output.path = config.deploy.js.path;
    myConfig.debug = false;
    myConfig.devtool = false;
    myConfig.plugins = [new webpack.optimize.UglifyJsPlugin()];
  }

  // run webpack
  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack]", stats.toString({
      colors: true
    }));
    callback();
  });
});

/*
 * Clean out the dist folder
 *
 */
gulp.task('clean', function () {
  return del([
    'dist/'
  ]);
});



gulp.task('generateHtml', function(callback) {
  runSequence(
    'cleanHtml',
    'fileinclude',
    callback);
});

/*
 * Clean out old html files
 *
 */
gulp.task('cleanHtml', function () {
  return del([
    config.public + '*.html',
    config.public + '**/*.html',
    config.public + '**/*.html'
  ]);
});

/*
 * generate html with includes
 *
 */
gulp.task('fileinclude', function() {
  gulp.src(config.src.html.files)
    .pipe(fileinclude({
      filters: {
        markdown: markdown.parse
      }
    }))
    .pipe(gulp.dest(config.public));
});

/*
 * Copy static files to dist folder
 *
 */
gulp.task('copyStaticFiles', function () {
      return gulp.src(config.staticSrc, {
          base: config.public
      }).pipe(gulp.dest('dist'));
});

