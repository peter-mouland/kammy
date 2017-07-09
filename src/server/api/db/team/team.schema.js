const mongoose = require('mongoose');

const PlayerType = {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  name: String,
  code: Number,
  club: String,
};

const TeamSchema = new mongoose.Schema({
  dateCreated: { type: Date, default: Date.now },
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String
  },
  season: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season'
    },
    name: String
  },
  division: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season.divisions'
    },
    name: String
  },
  name: String,
  gameWeek: {
    points: { type: Number, default: 0 },
    transfersRequested: { type: Number, default: 0 },
    transfersMade: { type: Number, default: 0 },
    gk: { type: Number, default: 0 },
    cbleft: { type: Number, default: 0 },
    cbright: { type: Number, default: 0 },
    fbleft: { type: Number, default: 0 },
    fbright: { type: Number, default: 0 },
    cmleft: { type: Number, default: 0 },
    cmright: { type: Number, default: 0 },
    wmleft: { type: Number, default: 0 },
    wmright: { type: Number, default: 0 },
    strleft: { type: Number, default: 0 },
    strright: { type: Number, default: 0 },
    sub: { type: Number, default: 0 },
  },
  total: {
    points: { type: Number, default: 0 },
    transfersRequested: { type: Number, default: 0 },
    transfersMade: { type: Number, default: 0 },
    gk: { type: Number, default: 0 },
    cbleft: { type: Number, default: 0 },
    cbright: { type: Number, default: 0 },
    fbleft: { type: Number, default: 0 },
    fbright: { type: Number, default: 0 },
    cmleft: { type: Number, default: 0 },
    cmright: { type: Number, default: 0 },
    wmleft: { type: Number, default: 0 },
    wmright: { type: Number, default: 0 },
    strleft: { type: Number, default: 0 },
    strright: { type: Number, default: 0 },
    sub: { type: Number, default: 0 },
  },
  gk: PlayerType,
  cbleft: PlayerType,
  cbright: PlayerType,
  fbleft: PlayerType,
  fbright: PlayerType,
  cmleft: PlayerType,
  cmright: PlayerType,
  wmleft: PlayerType,
  wmright: PlayerType,
  strleft: PlayerType,
  strright: PlayerType,
  sub: PlayerType,
});


module.exports = mongoose.model('Team', TeamSchema);
