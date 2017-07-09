// https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API
// http://nightwatchjs.org/guide#using-page-objects
const { findRoute } = require('../../../src/app/routes');

const commands = {
  thenDisplays: function(element) {
    return this.section.main
      .waitForElementPresent(element, 1000)
      .assert.visible(element);
  }
};

module.exports = {

  url: function () {
    return findRoute('divisions').path;
  },

  commands: [commands],

  elements: [{
    main: "#divisions-page"
  }],

  sections: {

    main: {

      selector: '#divisions-page',
      locateStrategy: 'css selector',

    }
  }
};
