/* globals require */


const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel        = require('gulp-babel');
const concat       = require('gulp-concat');
const cssmin       = require('gulp-cssmin');
const del          = require('del');
const escapeRegex  = require('escape-string-regexp');
const insert       = require('gulp-insert');
const jscs         = require('gulp-jscs');
const jscsStylish  = require('gulp-jscs-stylish');
const jshint       = require('gulp-jshint');
const path         = require('path');
const rename       = require('gulp-rename');
const replace      = require('gulp-replace');
const runSequence  = require('run-sequence');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');
const util         = require('gulp-util');




// ------------------------- //
// Helpers                   //
// ------------------------- //

String.EMPTY = '';
String.SPACE = ' ';



// ------------------------- //
// Configuration             //
// ------------------------- //

var config = {
  pkg: require('./package.json'),

  build:   { dir: 'build/' },
  dist:    { dir: 'dist/' },
  docs:    { dir: 'docs/' },
  lint:    {},
  reports: { dir: 'reports/' },
  src:     { dir: 'src/' },
  tests:   { dir: 'test/' }
};


// jscs:disable disallowOperatorBeforeLineBreak

config.fileHeader =
`/*!
 * ${config.pkg.name}.js (${config.pkg.version})
 *
 * Copyright (c) ${(new Date()).getFullYear()} Brandon Sara (http://bsara.github.io)
 * Licensed under the CPOL-1.02 (https://github.com/bsara/resizable-drawer.js/blob/master/LICENSE.md)
 */
`;

config.umdHeader =
`;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
    return;
  }
  if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
    return;
  }
  root.ResizableDrawer = factory(undefined, {}, undefined);
}(this, function(require, exports, module) {
`;

config.umdFooter = '\n}));\n';

// jscs:enable disallowOperatorBeforeLineBreak


config.lint.selectors = [
  'gulpfile.js',
  path.join(config.src.dir, '**/*.js'),
  path.join(config.tests.dir, '**/*.js')
];




// ------------------------- //
// Tasks                     //
// ------------------------- //

gulp.task('default', [ 'help' ]);



gulp.task('help', function() {
  var header = util.colors.bold.blue;
  var task   = util.colors.green;

  console.log(String.EMPTY);
  console.log(header(`${config.pkg.name}.js Gulp Tasks`));
  console.log(header(`------------------------------------------------------------------------------`));
  console.log(`  ${task("help")} (${util.colors.yellow("default")}) - Displays this message.`);
  console.log(String.EMPTY);
  console.log(`  ${task("build")}          - Builds the project.`);
  console.log(`  ${task("build:scripts")}  - Builds the project scripts.`);
  console.log(`  ${task("build:styles")}   - Builds the project styles.`);
  console.log(`  ${task("rebuild")}        - Cleans the build folder, then builds the project.`);
  console.log(`  ${task("dist")}           - Performs all needed tasks to prepare the built project`);
  console.log(`                   for a new release.`);
  console.log(String.EMPTY);
  console.log(`  ${task("clean")}          - Runs all available cleaning tasks in parallel.`);
  console.log(`  ${task("clean:build")}    - Cleans the build output directory.`);
  console.log(`  ${task("clean:dist")}     - Cleans the distribution output directory.`);
  console.log(String.EMPTY);
  console.log(`  ${task("lint")}           - Runs all available linting tasks in parallel.`);
  console.log(`  ${task("jshint")}         - Runs JSHint on the project source files.`);
  console.log(`  ${task("jscs")}           - Runs JSCS on the project source files.`);
  console.log(String.EMPTY);
});



// Build Tasks
// ----------------

gulp.task('build', [ 'build:scripts', 'build:styles' ], function() {
});


gulp.task('build:scripts', function() {
  return gulp.src(path.join(config.src.dir, '**', '*.js'))
             .pipe(replace(/\s*\/\/\s*js(hint\s|cs:).*$/gmi, String.EMPTY))
             .pipe(replace(/\s*\/\*\s*(js(hint|lint|cs:)|global(|s)|export(ed|s))\s.*?\*\/\s*\n/gmi, String.EMPTY))
             .pipe(insert.prepend(config.fileHeader))
             .pipe(gulp.dest(config.build.dir))
             .pipe(sourcemaps.init())
             .pipe(babel())
             .pipe(replace(new RegExp(escapeRegex(config.fileHeader), 'g'), String.EMPTY))
             .pipe(concat(`${config.pkg.name}.es5.js`))
             .pipe(replace(/exports\.default\s=/g, "return exports.default ="))
             .pipe(insert.prepend(config.umdHeader))
             .pipe(insert.append(config.umdFooter))
             .pipe(insert.prepend(config.fileHeader))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest(config.build.dir));
});


gulp.task('build:styles', function() {
  return gulp.src(path.join(config.src.dir, '**', '*.css'))
             .pipe(autoprefixer({
               browsers: [ 'last 3 versions' ],
               remove:   true
             }))
             .pipe(concat(`${config.pkg.name}.css`))
             .pipe(insert.prepend(config.fileHeader))
             .pipe(gulp.dest(config.build.dir))
             .pipe(rename({ extname: '.scss' }))
             .pipe(gulp.dest(config.build.dir));
});


gulp.task('rebuild', function(callback) {
  return runSequence('clean:build', 'build', callback);
});


gulp.task('dist', function(callback) {
  // TODO: Get script minification working and add to run sequence!
  return runSequence('lint', [ 'clean:build', 'clean:dist' ], 'build', 'test', [ 'dist:styles' ], function(err) {
    if (err) {
      callback(err);
      return;
    }

    gulp.src(path.join(config.build.dir, '**', '*'))
        .pipe(gulp.dest(config.dist.dir));

    callback();
  });
});


gulp.task('dist:scripts', function() {
  return gulp.src(path.join(config.build.dir, '**', '*.es5.js'))
             .pipe(sourcemaps.init({ loadMaps: true }))
             .pipe(uglify({ preserveComments: 'some' }))
             .pipe(rename({ suffix: '.min' }))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest(config.dest.dir));
});


gulp.task('dist:styles', function() {
  return gulp.src(path.join(config.build.dir, '**', '*.css'))
             .pipe(sourcemaps.init())
             .pipe(cssmin())
             .pipe(rename({ suffix: '.min' }))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest(config.dist.dir));
});



// Test Tasks
// ----------------

gulp.task('test', function() {
  util.log(util.colors.yellow("Tests are not yet implemented!"));
});



// Clean Tasks
// ----------------

gulp.task('clean', [ 'clean:build', 'clean:dist' ]);


gulp.task('clean:build', function() {
  return del(config.build.dir);
});


gulp.task('clean:dist', function() {
  return del(config.dist.dir);
});



// Lint Tasks
// ----------------

gulp.task('lint', [ 'jshint', 'jscs' ]);


gulp.task('jshint', function() {
  return gulp.src(config.lint.selectors)
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
             .pipe(jshint.reporter('fail', { verbose: true }));
});


gulp.task('jscs', function() {
  return gulp.src(config.lint.selectors)
             .pipe(jscs({ verbose: true }))
             .pipe(jscsStylish());
});
