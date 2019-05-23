'use strict';

module.exports = function(template, object, options) {
  if (typeof options === 'undefined') {
    options = object;
    object = this;
  }

  if (this.moduleOffset) {
    template += '-' + this.moduleOffset + '-';
  }

  var articles = Object.keys(object.articleBody)
  .filter(key => key.startsWith(template))
  .reduce((objects, key) => {
    var structure = key.match(/([^0-9]+)\-([0-9]+)(.*)$/);

    if (structure) {
      if (!objects[structure[2]]) {
        objects[structure[2]] = { };
      }

      objects[structure[2]][structure[1] + structure[3]] = object.articleBody[key];
    }

    return objects;
  }, { });

  return Object.keys(articles).map((key) => {
    return options.fn({
      'articleBody': articles[key]
    }, {
      'data': {
        'index': key
      }
    });
  }).join('');
}
