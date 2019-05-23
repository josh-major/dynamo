'use strict';

var helper = require('handlebars-helpers/lib/object');
var handlebars = require('handlebars');

module.exports = function(list, property, match, options) {
  var regex = new RegExp(match);

  list = Array.isArray(list) ? list : [];

  var matched = (property && match) ? list.filter(function(object) {
    try {
      return helper.get(property, object).match(regex);
    } catch (error) {
      return false;
    }
  }) : list;

  if (matched.length && typeof options.fn === 'function') {
    return options.fn(matched);
  } else if (typeof options.inverse === 'function') {
    return options.inverse();
  }
};
