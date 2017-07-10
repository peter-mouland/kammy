//https://docs.mongodb.com/manual/reference/mongo-shell/
// use kammy--test
// db.users.find()

const mongoose = require('mongoose');
const assert = require('assert');

const Player = mongoose.model('Player');

module.exports.puke = (playersJson) => {
  console.log('inserting test players....');
  return playersJson.map((player) => {
    const newPlayer = new Player(player);
    return newPlayer.save();
  })
};


module.exports.nuke = (player) => new Promise((resolve, reject) => {
  console.log(`removing`, player, ` from ${Player.db.name}....`);
  Player.remove(player, (err, r)=>{
      assert.equal(null, err);
      // assert.equal(1, r.nRemoved);
      if (err){
        reject(err);
      } else {
        resolve(r.nRemoved);
      }
    });
});


