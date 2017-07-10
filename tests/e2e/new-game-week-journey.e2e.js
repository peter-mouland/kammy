/*
 * Test: new-game-week-journey.e2e.js
 * Purpose:
 *   To test incrementing a game-week in an existing season
 *   i.e. an existing user can login and fetch stats, save the game-week stats and confirm team points
 */
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
  '@disable': true,
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
      // .pageLoaded(`/api/puke/new-game-week-journey/${fakeEmail}/${fakePassword}`)
      .pageLoaded(findRoute('homepage').path, { selector : '#home-page' })
      .deleteCookies();
  },

  after(browser){
    // browser
    //   .pageLoaded('/api/nuke/users/' + fakeEmail)
    //   .pageLoaded('/api/nuke/seasons/' + fakeSeason)
  },

  ['should be on the homepage'](browser) {
    browser.expect.element('.layout.layout--main').to.be.present;
  },


};
