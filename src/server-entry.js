require('babel-polyfill');
require('@kammy/node-local-storage');
require('@kammy/node-fetch');
require('./server/utils/assets-helper');
require('./config/config');

const { connect } = require('./server/api/db');
const config = require('./config/db.js');

connect(config.dbUri);

const getAssets = require('./server/utils/getAssets');
const createServer = require('./server/server'); //eslint-disable-line

const assets = getAssets();
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
