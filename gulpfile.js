'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync')
const nodemon = require('gulp-nodemon')

gulp.task('default', ['browser-sync'], () => { })

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:5000',
    files: ['assets/**/*.*', 'templates/**/*.*', 'data/*.*']
  })
})

gulp.task('nodemon', (done) => {
  let started = false

  return nodemon({
    script: 'index.js'
  }).on('start', function () {
    if (!started) {
      started = true
      done()
    }
  })
})
