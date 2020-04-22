'use strict';

/**
 * Normalizes dynamic content link structures for partial use.
 * @param  {String} index - The index of the parent content property (2 in menu-link-2)
 * @param  {String} prefix - The prefix to use for the menu item (menu in menu-link-2)
 * @param  {Object} options - The handlebars options object
 * @return {String} The resulting HTML
 */
module.exports = function(index, prefix, subprefix, options) {
  if (typeof prefix === 'object') {
    options = prefix;
    prefix = 'menu';
    subprefix = 'submenu';
  } else if (typeof subprefix === 'object') {
    options = subprefix;
    subprefix = prefix;
  }

  var link = prefix + '-link-' + index;
  var sublink = prefix + '-link-' + index;
  var deltaLength = link.length + subprefix.length - prefix.length;
  var context = { };

  if (this) {
    if (this[link]) {
      context.link = this[link];
      context['anchor-text'] = this[prefix + '-anchor-text-' + index];
    }

    Object.keys(this).forEach(function(key) {
      var subkey = prefix + key.slice(subprefix.length, deltaLength);

      if (subkey === link && key !== link) {
        var dropdown = key.slice(deltaLength);

        context['link' + dropdown] = this[key];
        context['anchor-text' + dropdown] = this[subprefix + '-anchor-text-' + index + dropdown];
      }
    }.bind(this));

    if (Object.keys(context).length > 0) {
      return options.fn(context);
    }
  }
};
