// https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API
// http://nightwatchjs.org/guide#using-page-objects
import { findRoute } from '../../../src/app/routes';

const commands = {
  addSeason: function(season) {
    return this.section.seasons.waitForElementVisible('@seasonInput', 1000)
      .setValue('@seasonInput', season)
      .click('@seasonSubmitButton')
  },
  addDivision: function(season) {
    return this.section.seasons.waitForElementVisible('@divisionInput', 1000)
      .setValue('@divisionInput', season)
      .click('@divisionSubmitButton')
  },
  thenDisplays: function(element) {
    return this.section.main
      .waitForElementPresent(element, 1000)
      .assert.visible(element);
  },
};


module.exports = {

  url: function () {
    return findRoute('admin').path;
  },

  commands: [commands],

  elements: [{
    main: "#admin-page",
    adminNav: "[data-test=admin-list--main-nav]",
    seasonsLink: "a.admin-list__text--seasons",
    usersLink: "a.admin-list__text--users",
    playersLink: "a.admin-list__text--players"
  }],

  sections: {
    main: {
      selector: '#admin-page',
      locateStrategy: 'css selector'
    },

    seasons: {
      selector: '.admin__panel.admin__panel--seasons',
      locateStrategy: 'css selector',

      elements: [{
        seasonList: "[data-test=admin-list--season]",
        seasonInput: "[data-test=admin-list--season] input[type=text]",
        seasonLink: "[data-test=admin-list--season] :first-child a",
        seasonSubmitButton: "[data-test=admin-list--season] input[type=submit]",
        seasonAdminOptions: "[data-test=admin-options--season]",
        divisionList: "[data-test=admin-list--division]",
        divisionInput: "[data-test=admin-list--division] input[type=text]",
        divisionLink: "[data-test=admin-list--division] :first-child a",
        divisionSubmitButton: "[data-test=admin-list--division] input[type=submit]",
        divisionAdminOptions: "[data-test=admin-options--division]",
      }],
    },

    users: {
      selector: '.admin__panel.admin__panel--users',
      locateStrategy: 'css selector'
    },

    players: {
      selector: '.admin__panel.admin__panel--players',
      locateStrategy: 'css selector'
    }
  }
};
