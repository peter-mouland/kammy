const debug = require('debug');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const PassportLocalStrategy = require('passport-local').Strategy;
const dbConfig = require('../../../config/db.js');

const log = debug('kammy:local-login');

const ObjectId = mongoose.Types.ObjectId;
const User = mongoose.model('User');
const Team = mongoose.model('Team');

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim()
  };

  // find a user by email address
  return User.findOne({ email: userData.email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (passwordErr) { return done(passwordErr); }

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      Team.find().exec((e, teams) => log(e) && log(teams));
      return Team.findOne({ 'user._id': new ObjectId(user._id) })
        .sort({ dateCreated: -1 }).exec((e, team) => {
          if (e || !team) {
            log(e || { team });
            const error = new Error('No Team found, should have been inserted automatically');
            error.name = 'SignUpError';
            return done(error);
          }
          const payload = {
            sub: user._id,
            email: user.email,
            defaultTeamId: team._id,
            isAdmin: user.isAdmin,
            mustChangePassword: user.mustChangePassword,
            name: user.name
          };

          // create a token string
          const token = jwt.sign(payload, dbConfig.jwtSecret);
          const data = {
            name: user.name
          };

          return done(null, token, data);
        });
    });
  });
});
