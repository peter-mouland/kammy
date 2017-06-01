const mongoose = require('mongoose');

const PlayerType = {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  name: String,
  club: String,
  gwPoints: Number,
  totalPoints: Number
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
  league: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season.leagues'
    },
    name: String
  },
  name: String,
  gw: {
    points: Number,
    transfersRequested: Number,
    transfersMade: Number
  },
  total: {
    points: Number,
    transfersRequested: Number,
    transfersMade: Number
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
