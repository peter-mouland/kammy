//https://docs.mongodb.com/manual/reference/mongo-shell/
// use kammy--test
// db.users.find()

const mongoose = require('mongoose');
const assert = require('assert');

const Season = mongoose.model('Season');

module.exports.puke = (user) => new Promise((resolve, reject) => {
  console.log('inserting test seasons....');
  Season.collection.insert(user, function (err, r) {
    assert.equal(null, err);
    console.log(r);
    if (err){
      reject(err);
    } else {
      resolve(r.insertedIds);
    }
  });
});


module.exports.nuke = (season) => new Promise((resolve, reject) => {
  console.log(`removing`, season, ` from ${Season.db.name}....`);
  Season.remove(season, (err, r)=>{
      assert.equal(null, err);
      // assert.equal(1, r.nRemoved);
      if (err){
        reject(err);
      } else {
        resolve(r.nRemoved);
      }
    });
});


