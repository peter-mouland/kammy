import Chance from 'chance';

import { findRoute } from '../../src/app/routes';

const chance = new Chance();
let fakeSeason;
let fakeDivision;
let fakeEmail;
let fakePassword;
let adminPage;
let loginPage;
let pageLayout;
let homePage;
let myTeamPage;
let divisionsPage;
let logoutPage;

module.exports = {
  '@tags': ['staging'],
  before(browser) {
    fakeSeason = `test-${chance.word()}`;
    fakeDivision = `test-${chance.word()}`;
    fakeEmail = `test-${chance.email()}`;
    fakePassword = `test-${chance.sentence({words: 5})}`;
    adminPage = browser.page.admin();
    loginPage = browser.page.login();
    pageLayout = browser.page.layout();
    homePage = browser.page.homepage();
    myTeamPage = browser.page.myteam();
    divisionsPage = browser.page.divisions();
    logoutPage = browser.page.logout();

    browser
      .pageLoaded(`/api/puke/new-season-journey/${fakeEmail}/${fakePassword}`)
      .pageLoaded(findRoute('homepage').path, { selector : '#home-page' })
      .deleteCookies();
  },

  after(browser){
    browser
      .pageLoaded('/api/nuke/users/' + fakeEmail)
      .pageLoaded('/api/nuke/seasons/' + fakeSeason)
  },

  ['should be able to login'](browser) {
    pageLayout.section.nav.click('@loginLink');
    loginPage.login(fakeEmail, fakePassword);
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
    adminPage.section.seasons.expect.element('@divisionList').to.be.visible
  },

  ['should be able to add a division to the season'](browser) {
    adminPage.addDivision(fakeDivision);
    adminPage.section.seasons.waitForElementPresent('@divisionLink', 1000);
    adminPage.section.seasons.expect.element('@divisionLink').to.be.visible;
  },

  ['should not be able to add a new division with the same name'](browser) {
  //  todo: fix + test this
  },

  ['should be able to view division details'](browser) {
    adminPage.section.seasons.click('@divisionLink');
    adminPage.section.seasons.waitForElementPresent('@divisionAdminOptions', 1000);
    adminPage.section.seasons.expect.element('@divisionAdminOptions').to.be.visible
  },

};
