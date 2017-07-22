require('babel-polyfill');
const hook = require('node-hook').hook;
const SvgLoader = require('svg-inline-loader');

hook('.scss', () => '');
hook('.svg', (source) => {
  const markup = SvgLoader.getExtractedSVG(source, { removeSVGTagAttrs: false });
  return `module.exports =  ${JSON.stringify(markup)}`;
});

const connect = require('./server/api/db').connect;
const config = require('./config/db.js');
const getAssets = require('./server/utils/getAssets');
require('./config/config');

connect(config.dbUri);

const assets = getAssets();
const createServer = require('./server/server'); //eslint-disable-line
const server = createServer(assets, process.env.NODE_ENV === 'development');

server.listen(process.env.PORT, () => {
  console.log(`listening at http://localhost:${process.env.PORT}`); // eslint-disable-line
});

// if (!module.parent) {
//   server.listen(process.env.PORT, () => {
//     console.log(`listening at http://localhost:${process.env.PORT}`); // eslint-disable-line
//   });
// } else {
//   module.exports = server;
// }
