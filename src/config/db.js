const env = require('./config');

module.exports = {
  dbUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET
};
