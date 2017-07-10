//https://docs.mongodb.com/manual/reference/mongo-shell/
// use kammy--test
// db.users.find()

const mongoose = require('mongoose');
const assert = require('assert');

const Season = mongoose.model('Season');

module.exports.puke = (season) => {
  console.log('inserting test seasons....');
  const newSeason = new Season(season);
  return newSeason.save();
};

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


