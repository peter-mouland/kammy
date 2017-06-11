import Chance from 'chance';

import { findRoute } from '../../src/app/routes';

const chance = new Chance();
let fakeSeason;
let fakeLeague;
let fakeEmail;
let fakePassword;
let adminPage;
let loginPage;
let pageLayout;
let homePage;
let dashboardPage;
let logoutPage;

module.exports = {
  '@tags': ['staging'],
  before(browser) {
    fakeSeason = `test-${chance.word()}`;
    fakeLeague = `test-${chance.word()}`;
    fakeEmail = `uni_nake@hotmail.com`;
    fakePassword = `test-${chance.sentence()}`;
    adminPage = browser.page.admin();
    loginPage = browser.page.login();
    pageLayout = browser.page.layout();
    homePage = browser.page.homepage();
    dashboardPage = browser.page.dashboard();
    logoutPage = browser.page.logout();
    browser
      .pageLoaded(findRoute('homepage').path, { selector : '#homepage' })
      .deleteCookies();
  },

  after(browser){
    browser
      .url(browser.globals.TARGET_PATH + '/api/nuke/users/' + fakeEmail)
      .url(browser.globals.TARGET_PATH + '/api/nuke/seasons/' + fakeSeason)
  },

  ['should be able to sign-up'](browser) {
    pageLayout.section.nav.click('@loginLink');
    loginPage.signUp(fakeEmail, fakePassword);
    pageLayout.thenDisplays('nav', '@adminLink');
  },

  ['should be able to go to the admin page'](browser) {
    pageLayout.section.nav.click('@adminLink');
    adminPage.waitForElementPresent('@main', 1000);
    adminPage.expect.section('@main').to.be.visible;
    adminPage.section.seasons.waitForElementPresent('@seasonList', 1000);
  },

  ['should be able to add a new season (with no initial restrictions)'](browser) {
    adminPage.addSeason(fakeSeason);
    adminPage.section.seasons.waitForElementPresent('@seasonLink', 1000);
    adminPage.section.seasons.expect.element('@seasonLink').to.be.visible;
  },

  ['should not be able to add a new season with the same name'](browser) {
    //  todo: fix + test this
  },

  ['should be able to view season details'](browser) {
    adminPage.section.seasons.click('@seasonLink');
    adminPage.section.seasons.waitForElementPresent('@seasonAdminOptions', 1000);
    adminPage.section.seasons.expect.element('@leagueList').to.be.visible
  },

  ['should be able to add a league to the season'](browser) {
    adminPage.addLeague(fakeLeague);
    adminPage.section.seasons.waitForElementPresent('@leagueLink', 1000);
    adminPage.section.seasons.expect.element('@leagueLink').to.be.visible;
  },

  ['should not be able to add a new league with the same name'](browser) {
  //  todo: fix + test this
  },

  ['should be able to view league details'](browser) {
    adminPage.section.seasons.click('@leagueLink');
    adminPage.section.seasons.waitForElementPresent('@leagueAdminOptions', 1000);
    adminPage.section.seasons.expect.element('@leagueAdminOptions').to.be.visible
  },

};
