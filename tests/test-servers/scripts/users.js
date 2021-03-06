//https://docs.mongodb.com/manual/reference/mongo-shell/
// use kammy--test
// db.users.find()

const mongoose = require('mongoose');
const assert = require('assert');

const { addUser, saveNewUser } = require('../../../src/server/api/db/user/user.actions');

const User = mongoose.model('User');

module.exports.generateUser = (user) => {
  console.log('generating test users....', user);
  return addUser(user);
};

module.exports.puke = (user) => {
  console.log('inserting test users....', user);
  return saveNewUser(user);
};

module.exports.nuke = (user) => new Promise((resolve, reject) => {
  console.log(`removing`, user,` from ${User.db.name}....`);
  User.remove(user, (err, r)=>{
      assert.equal(null, err);
      // assert.equal(1, r.nRemoved);
      if (err){
        reject(err);
      } else {
        resolve(r.nRemoved);
      }
    });
});


