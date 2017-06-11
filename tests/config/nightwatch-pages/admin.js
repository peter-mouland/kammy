// https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API
// http://nightwatchjs.org/guide#using-page-objects
import { findRoute } from '../../../src/app/routes';

const commands = {
  addSeason: function(season) {
    return this.section.seasons.waitForElementVisible('@seasonInput', 1000)
      .setValue('@seasonInput', season)
      .click('@seasonSubmitButton')
  },
  addLeague: function(season) {
    return this.section.seasons.waitForElementVisible('@leagueInput', 1000)
      .setValue('@leagueInput', season)
      .click('@leagueSubmitButton')
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
    main: "#admin-page"
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
        leagueList: "[data-test=admin-list--league]",
        leagueInput: "[data-test=admin-list--league] input[type=text]",
        leagueLink: "[data-test=admin-list--league] :first-child a",
        leagueSubmitButton: "[data-test=admin-list--league] input[type=submit]",
        leagueAdminOptions: "[data-test=admin-options--league]",
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
