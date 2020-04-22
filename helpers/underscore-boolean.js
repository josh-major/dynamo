'use strict';

var extend = require('extend');
var handlebars = require('handlebars');

module.exports = function(array, options) {
  var override = { };
  var underscored = { };

  array.forEach(function(item) {
    if (item.value === '0' || item.value === '1') {
      underscored['_' + item.propertyID] = parseInt(item.value) ? true : false;
    }
  });

  if (typeof options.fn === 'function') {
    try {
      override = JSON.parse(options.fn(this));
    } catch (error) {
      console.error(error)
      // Do nothing
    }
  }

  return new handlebars.SafeString(JSON.stringify(extend(underscored, override)));
}