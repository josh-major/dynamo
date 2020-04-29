"use strict";
// Template related JavaScript

// jQuery(function() {
//   initSlickCarousel();
// });

(function() {

var mountForms = function mountForms(form) {
  // return selected option of passed select
  function getSelectedOption(sel) {
    var opt;

    for (var i = 0, len = sel.options.length; i < len; i++) {
      opt = sel.options[i];

      if (opt.selected === true) {
        break;
      }
    }

    return opt;
  }

  var capitalize = function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  var getResultLink = function getResultLink() {
    var formFields = form.querySelectorAll('select');
    return getSelectedOption(formFields[formFields.length - 1]).dataset.link;
  };

  var nextStepPage = function nextStepPage() {
    var name = getCurrantPage();
    return name === '/' ? '/make/' : name === 'make' ? '/vehicle/' : null;
  };
  /*
  watch on select change
  args: selectField - field to watch on
  name: string name of select field wich containes in vehicle-form
  */


  var listenOptionsLink = function listenOptionsLink(selectField, name) {
    selectField.addEventListener('change', function () {
      return optionAsLinkAction(selectField, name);
    });
  };

  var optionAsLinkAction = function optionAsLinkAction(selectField, name) {
    console.log('change');
    var option = getSelectedOption(selectField);
    sessionStorage.setItem(name + '-selected', option.value);
    var link = option.dataset.link;

    if (link) {
      if (link.startsWith('/')) {
        var nextPage = nextStepPage();
        if (nextPage) window.location.href = nextPage;
      } else {
        window.location.href = link;
      }
    }
  };

  var confirmBtn = function confirmBtn(name) {
    form.elements[name].addEventListener('change', function (event) {
      var value = event.target.value;
      var submitBtn = form.querySelector('button[type="submit"]');

      if (value) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('disabled');
      } else {
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled');
      }
    });
  };

  var removeFromSession = function removeFromSession(name) {
    try {
      sessionStorage.removeItem(name + '-options');
      sessionStorage.removeItem(name + '-selected');
    } catch (error) {
      console.log(error);
    }
  };
  /*
  generate html options from optionArray, args:
  optionsArray - each item of array must contains name and link
  selectField - element to push options
  name: string name of select field wich containes in vehicle-form
  */


  var pushOptions = function pushOptions(optionsArr, selectField, name) {
    var selectedOption = sessionStorage.getItem(name + '-selected');
    var optionsMakup = optionsArr.reduce(function (accumulator, option, index) {
      var defaultSelected = option.name === selectedOption ? 'selected' : '';

      if (index === 1) {
        var isFirstSelect = accumulator.name === selectedOption ? 'selected' : '';
        return "<option value=\"\" data-link=\"/\">".concat(capitalize(name), "</option><option value=\"").concat(accumulator.name, "\" data-link=\"").concat(accumulator.link, "\" ").concat(isFirstSelect, ">").concat(accumulator.name, "</option><option value=\"").concat(option.name, "\" data-link=\"").concat(option.link, "\" ").concat(defaultSelected, ">").concat(option.name, "</option>");
      } else {
        accumulator += "<option value=\"".concat(option.name, "\" data-link=\"").concat(option.link, "\" ").concat(defaultSelected, ">").concat(option.name, "</option>");
        return accumulator;
      }
    });
    selectField.innerHTML = optionsMakup;
    selectField.disabled = false;
    listenOptionsLink(selectField, name);
  };

  var getCurrantPage = function getCurrantPage() {
    var pageLocation = window.location.href; // pages checking /vehicle/ | /make/

    if (pageLocation.match("/vehicle/")) {
      return 'vehicle';
    } else if (pageLocation.match("/make/")) {
      return 'make';
    } else {
      return '/';
    }
  };

  var setNewSelectedItem = function setNewSelectedItem(optionName) {
    var event = new Event('change');
    var currantField = comparePageToFields();
    var field = document.querySelector("select[name=\"".concat(currantField, "\"]"));
    field.querySelector("option[value=\"".concat(optionName, "\"]")).selected = true;
    field.dispatchEvent(event);
  };

  var linkClickHandler = function linkClickHandler(e) {
    e.preventDefault();
    var link = e.target.getAttribute('href');
    var value = e.target.innerText;

    if (link) {
      if (link.startsWith('http')) {
        window.location.href = link;
      } else {
        sessionStorage.setItem(comparePageToFields() + '-selected', value);
        setNewSelectedItem(value);
        var nextPage = nextStepPage();
        if (nextPage) window.location.href = nextPage;
      }
    }
  };
  /*
  for creating options it require:
  name: string name of select field wich containes in vehicle-form
  shouldGenerateLinks: is this options can be generated with links on the page
  */


  var createSelectOptions = function createSelectOptions(name, shouldGenerateLinks, isLastField) {
    if (name === comparePageToFields()) {
      removeFromSession(name);
    }

    if (isLastField) {
      confirmBtn(name);
    }

    var options = sessionStorage.getItem(name + '-options'); // if exist in session use it as options, otherwise ↓

    if (options) {
      pushOptions(JSON.parse(options), form.elements[name], name);
    } else if (shouldGenerateLinks) {
      // get warpper of links
      var linksWrap = document.querySelector('[data-select-links]');
      var linksArray = [];

      try {
        linksWrap.querySelectorAll('a').forEach(function (link) {
          // link.addEventListener('click', linkClickHandler, false);

          if (link.innerText && link.getAttribute('href')) {
            linksArray.push({
              name: link.innerText,
              link: link.getAttribute('href')
            });
          }
        });
        sessionStorage.setItem(name + '-options', JSON.stringify(linksArray));
        pushOptions(linksArray, form.elements[name], name);
      } catch (error) {
        console.error('links wrapper require have [data-select-links] attribue \n \n', error);
      }
    }
  }; // init vehicle form


  form.addEventListener('submit', function (event) {
    event.preventDefault();
    window.location.href = getResultLink();
  });

  var compareFielTodPage = function compareFielTodPage(fieldName) {
    return fieldName === 'year' ? '/vehicle/' : fieldName === 'model' ? '/make/' : '/';
  };

  var comparePageToFields = function comparePageToFields() {
    var currantPage = getCurrantPage();
    return currantPage === '/' ? 'make' : currantPage === 'make' ? 'model' : currantPage === 'vehicle' ? 'year' : false;
  };

  var redirectIfNoDelected = function redirectIfNoDelected(name) {
    if (!sessionStorage.getItem(name + '-selected') || !sessionStorage.getItem(name + '-options')) window.location.href = compareFielTodPage(name);
  };

  switch (getCurrantPage()) {
    case 'vehicle':
      redirectIfNoDelected('make');
      redirectIfNoDelected('model');
      createSelectOptions('make', false);
      createSelectOptions('model', false);
      createSelectOptions('year', true, true);
      break;

    case 'make':
      redirectIfNoDelected('make');
      createSelectOptions('make', false);
      createSelectOptions('model', true);
      break;

    case '/':
      createSelectOptions('make', true);
      break;

    default:
      window.location.href = '/';
  }
}; // on document load function



var createSelect = function createSelect(select) {
  var selectField = select.querySelector('.custom-select');

  var toggleDropdown = function toggleDropdown(event) {
    selectField.innerText = event.target.innerText.trim();

    if (event.target.id === 'trim-disabled-tab') {
      selectField.classList.remove('selected');
    } else {
      selectField.classList.add('selected');
    }
  };

  select.querySelectorAll('.nav-link').forEach(function (item) {
    item.addEventListener('click', toggleDropdown);
  });
};

var initSelectMaintenance = function initSelectMaintenance(wrapper) {

  var arrowNav = function arrowNav(dirrection) {
    var currMilageSelect = document.querySelector('.tab-pane.active .dropdown-menu');
    var activeElem = currMilageSelect.querySelector('a.active').parentNode;

    if (dirrection === 'prev') {
      var prevEl = activeElem.previousElementSibling;

      if (prevEl) {
        prevEl.querySelector('a').click();
      } else {
        activeElem.parentNode.lastElementChild.querySelector('a').click();
      }
    } else if (dirrection === 'next') {
      var nextEl = activeElem.nextElementSibling;

      if (nextEl) {
        nextEl.querySelector('a').click();
      } else {
        activeElem.parentNode.firstElementChild.querySelector('a').click();
      }
    }
  };

  wrapper.addEventListener('click', function (event) {
    if (event.target.classList.contains('slick-prev')) {
      arrowNav('prev');
    }

    if (event.target.classList.contains('slick-next')) {
      arrowNav('next');
    }
  }, false);
  document.querySelectorAll('.dropdown').forEach(function (dropdown) {
    createSelect(dropdown);
  });
};


document.addEventListener("DOMContentLoaded", function (event) {
  var oilSelect = document.getElementById('oil-change-select')
  var form = document.getElementById('vehicle-form');
  var milageSelectes = document.getElementById('vehicle-milage');

  if (oilSelect)  createSelect(oilSelect)
  //   if (form) {
  //   mountForms(form);
  // }
  if (milageSelectes) initSelectMaintenance(milageSelectes);
});

  // var magicGrid = new MagicGrid({
  //   container: ".grid-container",
  //   static: true,
  //   gutter: 15,
  //   maxColumns: 4,
  //   useTransform: true,
  //   useMin: true
  // });

  // window.onload = function() {
  //   magicGrid.listen();
  // };
})();



