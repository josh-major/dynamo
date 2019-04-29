'use strict';

var handlebars = require('handlebars');

module.exports = function(property, options) {
  if (this.additionalProperty) {
    var propertyValue = this.additionalProperty.find(function(object) {
      return object.propertyID === property;
    });

    if (propertyValue) {
      if (typeof options.fn === 'function') {
        return options.fn(propertyValue);
      } else {
        return new handlebars.SafeString(propertyValue.value);
      }
    } else if (typeof options.inverse === 'function') {
      return options.inverse();
    }
  } else if (typeof options.inverse === 'function') {
    return options.inverse();
  }
};
