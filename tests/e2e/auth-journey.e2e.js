/*
 * Test: auth-journey.e2e.js
 * Purpose:
 *   Test login / sign up works
 *   i.e. a new user can register and login. plus, a new user can not register with a pre-registered email.
 */
import Chance from 'chance';

import { findRoute } from '../../src/app/routes';

const chance = new Chance();
let fakeEmail;
let fakePassword;
let loginPage;
let pageLayout;
let homePage;
let divisionsPage;
let myTeamPage;
let logoutPage;

module.exports = {
  '@tags': ['staging'],
  before(browser) {
    fakeEmail = `test-${chance.email()}`;
    fakePassword = `test-${chance.sentence()}`;
    loginPage = browser.page.login();
    pageLayout = browser.page.layout();
    homePage = browser.page.homepage();
    divisionsPage = browser.page.divisions();
    myTeamPage = browser.page.myteam();
    logoutPage = browser.page.logout();
    browser
      .pageLoaded(findRoute('homepage').path, { selector : '#home-page' })
      .deleteCookies();
  },

  after(browser){
    browser
      .url(browser.globals.TARGET_PATH + '/api/nuke/users/' + fakeEmail)
  },

  ['should not be able to see a the my-team without logging in'](browser) {
    const nav = pageLayout.section.nav;
    loginPage.expect.section('@main').not.to.be.present;
    nav.assert.visible('@myTeamLink');
    nav.click('@myTeamLink');
    loginPage.expect.section('@main').to.be.visible;
  },

  ['should not be able to log in with an unknown user'](browser) {
    const nav = pageLayout.section.nav;
    nav.click('@myTeamLink');
    loginPage.login(fakeEmail, fakePassword);
    loginPage.expect.section('@main').to.be.visible;
    loginPage.thenDisplays('@error');
  },

  ['should be able to sign-up, which would then go straight to the my-team page'](browser) {
    pageLayout.section.nav.click('@myTeamLink');
    loginPage.signUp(fakeEmail, fakePassword);
    myTeamPage.waitForElementPresent('@main', 1000);
    myTeamPage.expect.section('@main').to.be.visible;
  },
  ['should be able to log out'](browser) {
    pageLayout.section.nav.waitForElementPresent('@logoutLink', 1000);
    pageLayout.section.nav.click('@logoutLink');
    logoutPage.expect.section('@main').to.be.visible;
  },
  ['once logged out, going to the my-team page asks for log in again'](browser) {
    pageLayout.section.nav.click('@myTeamLink');
    loginPage.expect.section('@main').to.be.visible;
  },

  ['should not be able to sign-up with same details twice'](browser) {
    pageLayout.section.nav.click('@myTeamLink');
    loginPage.signUp(fakeEmail, fakePassword);
    loginPage.expect.section('@main').to.be.visible;
    loginPage.thenDisplays('@error');
  },
  ['can now log in as the previously signed up user'](browser) {
    pageLayout.section.nav.click('@myTeamLink');
    loginPage.login(fakeEmail, fakePassword);
    myTeamPage.waitForElementPresent('@main', 1000);
    myTeamPage.expect.section('@main').to.be.visible;
  },
  ['the system isnt fooled by a fake token cookie'](browser){
    return browser.setCookie({
        name: "token",
        value: "test_value",
        path: "/",
        secure: false,
        httpOnly: false
      })
      .pageLoaded(findRoute('homepage').path, { selector : '#home-page' })
      .perform(()=>{
        pageLayout.section.nav.click('@myTeamLink');
      }).perform(()=>{
        loginPage.waitForElementPresent('@main', 1000);
      }).perform(()=>{
        loginPage.expect.section('@main').to.be.visible;
      })
  },

  // ['hitting url with incorrect params return error, not unautherised'](){
  //    http://localhost:3000/api/game/:gameType(people%7Cfilms)/:card1/:card2
  // }
};
