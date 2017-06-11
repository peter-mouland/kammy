// https://github.com/nightwatchjs/nightwatch/wiki/Page-Object-API
// http://nightwatchjs.org/guide#using-page-objects

const commands = {
  thenDisplays: function(section = 'main', element) {
    return this.section[section]
      .waitForElementPresent(element, 1000)
      .assert.visible(element);
  },
};

module.exports = {

  url: function () {
    return this.api.launchUrl;
  },

  commands: [commands],

  sections: {
    nav: {
      selector: 'nav.layout__nav',
      locateStrategy: 'css selector',
      elements: {
        myTeamLink: 'a[href="/my-team/"]',
        adminLink: 'a[href="/admin/"]',
        dashboardLink: 'a[href="/dashboard/"]',
        loginLink: 'a[href="/login/"]',
        logoutLink: 'a[href="/logout/"]',
      },
    },
    main: {
      selector: 'main.layout__content',
      locateStrategy: 'css selector',
    },
    footer: {
      selector: 'footer.layout__footer',
      locateStrategy: 'css selector',
    },
  }
};
