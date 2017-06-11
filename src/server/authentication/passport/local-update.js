const debug = require('debug');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;

const { updateUser } = require('../../api/db/user/user.actions');

const log = debug('kammy:auth/local-update');

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

    return user.hashPassword(userData.password, (passwordErr, passwordObj) => {
      const payload = {
        ...userData,
        password: passwordObj.hash,
        salt: passwordObj.salt,
        mustChangePassword: false
      };
      log(payload);
      return updateUser(user._id, payload).then((updatedUser) => done(null, updatedUser));
    });
  });
});
