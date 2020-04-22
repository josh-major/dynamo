'use strict';

var handlebars = require('handlebars');

module.exports = function() {
  for (var i = 0; i < arguments.length - 1; i++) {
    if (typeof arguments[i] === 'string' && arguments[i] || typeof arguments[i] === 'number') {
      return new handlebars.SafeString(arguments[i]);
    }
  }
};
