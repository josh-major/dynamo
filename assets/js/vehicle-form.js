(function() {
  if (!document.getElementById('vehicle-form')) {
    return;
  }

  function createOption(text, value, selected) {
    var option = document.createElement('OPTION');

    option.innerText = text;
    option.setAttribute('value', value);

    if (selected) {
      option.setAttribute('selected', '');
    }

    return option;
  }

  function populateOptions(select) {

    document.querySelectorAll('main .listreset li a').forEach(function(item) {
      select.appendChild(createOption(item.innerText, item.getAttribute('href')));
    });
  }

  var path = window.location.pathname.split('/');
  var changeCase = require('change-case');
  var make = document.querySelector('#vehicle-form select[name=make]');
  var model = document.querySelector('#vehicle-form select[name=model]');
  var year = document.querySelector('#vehicle-form select[name=year]');

  path.shift();
  path.pop();

  if (path.length == 0 || path[0] == "assets") {
    populateOptions(make);
  } else {
    make.appendChild(createOption(changeCase.title(path[0]), '#', true));
    model.removeAttribute('disabled');

    document.querySelector('#vehicle-form select[name=make] option')
      .removeAttribute('disabled')

    if (path.length == 1) {
      populateOptions(model)
    } else {
      var modelOption = document.querySelector('#vehicle-form select[name=model] option');

      modelOption.setAttribute('value', '/' + path.slice(0, 1).join('/') + '/')
      modelOption.removeAttribute('disabled');

      model.appendChild(createOption(changeCase.title(path[1]), '#', true));

      year.removeAttribute('disabled');
      populateOptions(year);
    }
  }

  jQuery(function() {
    var keyed = false;

    function doNavigate() {
      if ($('option:selected', year).val() !== '#') {
        window.location.href = $('option:selected', year).val();
      } else if ($('option:selected', model).val() !== '#') {
        window.location.href = $('option:selected', model).val();
      } else if ($('option:selected', make).val() !== '#') {
        window.location.href = $('option:selected', make).val();
      }
    }

    $('#vehicle-form').on('submit', function(event) {
      event.preventDefault();
    });

    $('#vehicle-form select').on('change', function(event) {
      if ($('option:selected', this).val() === '#') {
        $('#vehicle-form button').addClass('disabled');
        $('#vehicle-form button').attr('disabled', '');
      } else {
        $('#vehicle-form button').removeClass('disabled');
        $('#vehicle-form button').removeAttr('disabled');

        if (!keyed) {
          doNavigate();
        }
      }
    }).on('keydown', function() {
      keyed = true;
    }).on('mousedown', function() {
      keyed = false;
    });

    $('#vehicle-form button').on('click', doNavigate);
  });
})();