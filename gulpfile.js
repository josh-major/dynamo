'use strict'

const browserSync = require('browser-sync')
const concat = require('gulp-concat')
const cssNested = require('postcss-nested')
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const postCSS = require('gulp-postcss')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sourceMaps = require('gulp-sourcemaps')

gulp.task('default', ['browser-sync'], () => { })

gulp.task('browser-sync', ['css', 'js', 'nodemon'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:5000',
    files: ['assets/**/*.*', 'templates/**/*.*']
  })

  gulp.watch(['assets/scss/**/*.*', 'assets/css/**/*.*'])
  .on('change', function() {
    return gulp.start('css')
  })

  gulp.watch(['assets/js/**/*.*'])
  .on('change', function() {
    return gulp.start('js')
  })
})

gulp.task('sass', function() {
  return gulp.src('assets/scss/common.scss')
    .pipe(sass())
    .pipe(rename('site.css'))
    .pipe(gulp.dest('assets/css/'))
})

gulp.task('css', ['sass'], function() {
  return gulp.src('assets/css/*.css')
  .pipe(sourceMaps.init())
  .pipe(concat('style.css'))
  .pipe(postCSS([cssNested]))
  .pipe(sourceMaps.write())
  .pipe(gulp.dest('assets/'))
})

gulp.task('js', function() {
  return gulp.src('assets/js/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('assets/'))
})

gulp.task('nodemon', (done) => {
  let started = false

  return nodemon({
    script: 'index.js',
    watch: ['data']
  }).on('start', function () {
    if (!started) {
      started = true
      done()
    }
  })
})
