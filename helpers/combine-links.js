'use strict';

var extend = require('extend');
var handlebars = require('handlebars');

module.exports = function(links, prefix, options) {
  var map = { };
  var set = [];

  if (this.moduleOffset) {
    prefix += '-' + this.moduleOffset;
  }

  try {
    var articleBody = options.data.root.articleBody;

    Object.keys(articleBody).forEach(function(key) {
      try {
        if (key.substr(0, prefix.length + 1) === prefix + '-' && key.match(/\-[0-9]+$/)) {

          var type = key.substr(prefix.length + 1, key.lastIndexOf('-') - prefix.length - 1);
          var offset = parseInt(key.substr(key.lastIndexOf('-') + 1));

          if ((type === 'link' || type === 'anchor-text') && !(offset in set)) {
            set[offset] = { };
          }

          if (type === 'link') {
            set[offset].url = articleBody[key];
          } else if (type === 'anchor-text') {
            set[offset].name = articleBody[key];
          }
        }
      } catch (error) { }
    });
  } catch (error) { }

  set.forEach(function(link) {
    map[link.name] = link;
  });

  links.forEach(function(link) {
    map[link.name] = link;
  });

  return options.fn(Object.keys(map).map(function(key) {
    return map[key];
  }));
};
