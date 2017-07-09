// https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API
// http://nightwatchjs.org/guide#using-page-objects
import { findRoute } from '../../../src/app/routes';

const commands = {
  thenDisplays: function(element) {
    return this.section.main
      .waitForElementPresent(element, 1000)
      .assert.visible(element);
  }
};

module.exports = {

  url: function () {
    return findRoute('homepage').path;
  },

  commands: [commands],

  elements: [{
    main: "#home-page"
  }],

  sections: {

    main: {

      selector: '#home-page',
      locateStrategy: 'css selector'

    }
  }
};
