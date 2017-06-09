import debug from 'debug';

const { forPlayer: calculatePoints } = require('../../../utils/calculatePoints');
const playersJson = require('../../../../../scripts/2016-2017/stats-GW25.json');

const Player = require('mongoose').model('Player');

const log = debug('kammy:db/player.actions');

export const findPlayers = (players = {}) => Player.find(players).exec();

export const findPlayer = (playerDetails) => Player.findOne(playerDetails).exec();

export const updatePlayers = ({ playerUpdates }) => {
  const bulkUpdate = playerUpdates.map((update) => ({
    updateOne: {
      filter: { _id: update._id }, update
    },
  }));
  return Player.bulkWrite(bulkUpdate).then(() => (playerUpdates));
};

export const importPlayers = () => (
  Object.keys(playersJson).map((key) => {
    const player = playersJson[key];
    const stats = {
      apps: player.apps,
      subs: player.subs,
      gls: player.gls,
      asts: player.asts,
      mom: player.mom,
      cs: player.cs,
      con: player.con,
      pensv: player.pensv,
      ycard: player.ycard,
      rcard: player.rcard,
    };
    player.gameWeek = {
      stats,
      points: calculatePoints(stats, player.pos)
    };
    player.total = {
      stats,
      points: calculatePoints(stats, player.pos)
    };
    player.name = player.player;
    const newPlayer = new Player(player);
    return newPlayer.save();
  })
);
