//https://docs.mongodb.com/manual/reference/mongo-shell/
// use kammy--test
// db.users.find()

const mongoose = require('mongoose');
const assert = require('assert');

const Teams = mongoose.model('Team');
const { saveNewTeam } = require('../../../src/server/api/db/team/team.actions');

module.exports.puke = (team) => {
  console.log('inserting test teams....');
  return saveNewTeam(team);
};


module.exports.nuke = (team) => new Promise((resolve, reject) => {
  console.log(`removing`, team, ` from ${Teams.db.name}....`);
  Teams.remove(team, (err, r)=>{
      assert.equal(null, err);
      // assert.equal(1, r.nRemoved);
      if (err){
        reject(err);
      } else {
        resolve(r.nRemoved);
      }
    });
});


