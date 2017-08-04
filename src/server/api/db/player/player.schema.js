const mongoose = require('mongoose');

const stats = {
  apps: Number,
  subs: Number,
  gls: Number,
  asts: Number,
  mom: Number,
  cs: Number,
  con: Number,
  pensv: Number,
  ycard: Number,
  rcard: Number,
  tb: Number,
  sb: Number,
  points: Number,
};

const mongooseSchema = {
  dateCreated: { type: Date, default: Date.now },
  name: {
    type: String,
    index: { unique: true }
  },
  code: Number,
  pos: String,
  club: String,
  isHidden: {
    type: Boolean,
    default: false
  },
  new: Boolean,
  gameWeek: stats,
  season: stats,
  pointsChange: Number,
  value: Number
};


module.exports = mongoose.model('Player', new mongoose.Schema(mongooseSchema));
module.exports.mongooseSchema = mongooseSchema;
