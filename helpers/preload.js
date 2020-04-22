'use strict';

var handlebars = require('handlebars');

/**
 * Creates HTML markup to include stylesheets
 * @param  {[String]} sheets - An array of CSS URIs
 * @return {String} HTML <link rel="stylesheet" /> markup
 */
function stylesheetLinks(sheets) {
  return sheets.map(function(href) {
    return '<link rel="stylesheet" href="' + href + '" />';
  }).join('');
}

module.exports = function() {
  var args = Array.prototype.slice.call(arguments);
  var sheets = args.slice(0, -1);
  var options = args.pop();

  return new handlebars.SafeString(stylesheetLinks(sheets.map(function(sheet) {
    return sheet.replace('.min.', '.');
  })));
};
