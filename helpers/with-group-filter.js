'use strict';

var helper = require('handlebars-helpers/lib/object');
var handlebars = require('handlebars');

module.exports = function(list, property, match, options) {
  var sorted = { };
  if (typeof match === 'object') {
    options = match;
    match = false;
  }

  (list || []).forEach(function(object) {
    var key = helper.get(property, object);

    if (typeof key === 'object') {
      key = JSON.stringify(key);
    }

    if (!match || match === key) {
      if (key in sorted) {
        sorted[key].push(object);
      } else {
        sorted[key] = [object];
      }
    }
  });

  return new handlebars.SafeString(Object.keys(sorted).sort().map(function(key, i) {
    return options.fn(sorted[key], {
      'data': {
        'index': key,
        'first': i === 0,
        'last': i === Object.keys(sorted).length - 1
      }
    });
  }).join(''));
};
