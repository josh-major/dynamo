'use strict';

var handlebars = require('handlebars');

module.exports = function(object, options) {
  return new handlebars.SafeString(object.url);
};
