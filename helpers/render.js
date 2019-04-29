'use strict';

var cache = new Map();
var html = require('html-entities').AllHtmlEntities;

module.exports = function(markup, key, options) {
  if (typeof markup !== 'undefined') {
    if (typeof markup === 'object') {
      markup = markup.toString();
    }

    markup = html.decode(markup);

    if (typeof key === 'object') {
      options = key;
      key = markup;
    }

    var handlebars = (global || window).handlebars;

    if (!cache.has(key)) {
      cache.set(key, handlebars.compile(markup));
    }

    return cache.get(key)(this);
  }
};
