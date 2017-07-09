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
    return findRoute('my-team').path;
  },

  commands: [commands],

  elements: [{
    main: "#my-team-page"
  }],

  sections: {

    main: {

      selector: '#my-team-page',
      locateStrategy: 'css selector',

    }
  }
};
