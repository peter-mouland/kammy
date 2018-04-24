const debug = require('debug');

const config = {};
const setEnvDefault = (key, val) => {
  if (!process.env[key]) {
    process.env[key] = val;
  }
  config[key] = process.env[key];
};

setEnvDefault('DEBUG', 'kammy:*');
setEnvDefault('PORT', 3000);
setEnvDefault('FIXTURES', 'false');
setEnvDefault('FIXTURES_PORT', 3001);
setEnvDefault('MONGODB_URI', 'mongodb://localhost/kammy');
setEnvDefault('JWT_SECRET', 'a secret phrase!!');

const graphQlUrl = config.FIXTURES === 'true'
  ? `http://localhost:${config.FIXTURES_PORT}/graphql`
  : '/graphql/v1';

setEnvDefault('GRAPHQL_URL', graphQlUrl);

const externalStatsUrl = 'https://fantasyfootball.skysports.com/cache/json_players.json';
setEnvDefault('EXTERNAL_STATS_URL', externalStatsUrl);

const externalFixturesUrl = 'https://fantasyfootball.skysports.com/cache';
setEnvDefault('EXTERNAL_FIXTURES_URL', externalFixturesUrl);

const internalStatsUrl = `http://localhost:${config.PORT}/2016-2017`;
setEnvDefault('INTERNAL_STATS_URL', internalStatsUrl);

debug.enable(process.env.DEBUG);
const log = debug('kammy: config:');

// explicitly check vars that webpack can help us with
if (!process.env.GA_KEY) { setEnvDefault('GA_KEY', 'development'); }
if (!process.env.NODE_ENV) { setEnvDefault('NODE_ENV', 'development'); }

config.adminEmails = ['nickwatts1982@hotmail.com', 'uni_nake@hotmail.com', 'oojdee@gmail.com'];
config.getFixtures = (code) => `${config.EXTERNAL_FIXTURES_URL}/json_player_stats_${code}.json`;
config.cookieToken = 'kammy-token';
config.playerPositions = require('./positions');

log(config);

module.exports = config;
module.exports.getVar = (key) => process.env[key];
