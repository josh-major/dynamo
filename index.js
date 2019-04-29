'use strict'

// Require dependencies
const { camelCase } = require('change-case')
const express = require('express')
const fs = require('fs')
const hbs = require('express-handlebars')
const path = require('path')

global.handlebars = require('handlebars')

// Configuration
const config = {
  'assets': './assets',
  'extension': '.hbs',
  'helpers': './assets/js/helpers',
  'data': './data/pages',
  'partials': './templates/partials/',
  'views': './',
  'port': 5000
}

// Load Express server and supporting data
const app = express()
const pages = require(config.data).reduce((pages, item) => {
  pages[item.url] = item;

  return pages;
}, { })
const helpers = fs.readdirSync(config.helpers)
  // Custom helpers
  .map((file) => path.join(__dirname, config.helpers, file))
  // Built in helpers
  .concat(fs.readdirSync('./helpers').map((file) => path.join(__dirname, 'helpers', file)))
  .filter((file) => file.endsWith('.js'))
  .reduce((helpers, file) => {
    helpers[camelCase(path.basename(file, '.js'))] = require(file)

    return helpers
  }, require('handlebars-helpers')())

// Configure Express server
app.engine(config.extension, hbs({
  handlebars: global.handlebars,
  extname: config.extension,
  partialsDir: config.partials,
  helpers: helpers
}))
app.set('view engine',config.extension)
app.set('views', config.views)

// Configure Middleware
app.use('/assets', express.static('assets'))
app.use((req, res, next) => {
  if (req.url in pages) {
    const page = pages[req.url]
    const render = (page.potentialAction || []).find((action) => action.name === 'renderHTML')

    if (render) {
      res.render(render.assembly, page, (error, html) => {
        if (error) {
          console.error(error);
        }

        error ? res.status(500).send(error.message) : res.send(html)
      })
    } else {
      res.status(500).send('Render action not found in data')
    }
  } else {
    res.status(404).send('Page not found in data')
  }
})

// Launch Express server
app.listen(config.port)
