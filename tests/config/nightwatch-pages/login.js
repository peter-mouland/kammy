// https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API
// http://nightwatchjs.org/guide#using-page-objects
// this.api.pause(1000);
const { findRoute } = require('../../../src/app/routes');

const commands = {
  login: function(email, password) {
    return this.section.main.waitForElementVisible('@emailInput', 1000)
      .setValue('@emailInput', email)
      .setValue('@passwordInput', password)
      .click('@chooseLoginInput')
      .click('@submitButton')
  },
  signUp: function(email, password) {
    return this.section.main.waitForElementVisible('@emailInput', 1000)
      .setValue('@emailInput', email)
      .setValue('@passwordInput', password)
      .click('@chooseSignUpInput')
      .click('@submitButton')
  },
  thenDisplays: function(element) {
    return this.section.main
      .waitForElementPresent(element, 1000)
      .assert.visible(element);
  }
};


module.exports = {

  url: function () {
    return findRoute('login').path;
  },

  commands: [commands],

  elements: [{
    main: "#login-page"
  }],

  sections: {

    main: {

      selector: '#login-page',
      locateStrategy: 'css selector',

      elements: [{
        error: '.form__error',
        submitButton: 'input[type=submit]',
        emailInput: 'input[type=email]',
        passwordInput: 'input[type=password]',
        chooseLoginInput: 'input[value=login]',
        chooseSignUpInput: 'input[value=signUp]',
      }]
    }
  }
};
