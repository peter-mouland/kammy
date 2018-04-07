require('babel-register')({
  only: [/src/, /tests/, /config/]
});
require("babel-polyfill");
require('@kammy/node-local-storage');
const connect = require('../../src/server/api/db').connect;
const config = require('../test-servers/db.json');
const { JSDOM } = require('jsdom');
const hook = require('node-hook').hook;
hook('.scss', (source, filename) => '');
hook('.svg', (source, filename) => '');

// Connect to test DB (needed for functional tests)
connect(config.dbUri);

// setup the simplest document possible
const { window } = new JSDOM(`
<!doctype html>
<html>
  <body>
    <div id="html"></div>
  </body>
</html>`);

// get the window object out of the document and set globals for mocha
global.document = window.document;
global.window = window;
global.HTMLElement = window.HTMLElement;

// take all properties of the window object and also attach it to the mocha global object
// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
propagateToGlobal(window);
function propagateToGlobal(win) {
  for (var key in win) {
    if (!win.hasOwnProperty(key)) continue;
    if (key in global) continue;
    global[key] = win[key];
  }
}


const chai = require('chai');
const sinonChai = require("sinon-chai");

// setup chai
chai.should();
chai.expect();
chai.use(sinonChai);
