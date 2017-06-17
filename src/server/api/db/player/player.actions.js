import debug from 'debug';

const { calculatePoints, mapper } = require('../../../utils/calculatePoints');
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

export const importToStats = (player, internal) => {
  const map = mapper(internal);
  const season = internal ? player : player.stats.season;

  const stats = {
    apps: season[map.STARTING_XI],
    subs: season[map.SUBS],
    gls: season[map.GOALS],
    asts: season[map.ASSISTS],
    mom: season[map.YELLOW_CARDS],
    cs: season[map.CLEAN_SHEETS],
    con: season[map.CONCEDED],
    pensv: season[map.SAVED_PENALTIES],
    ycard: season[map.YELLOW_CARDS],
    rcard: season[map.RED_CARDS],
  };
  player.gameWeek = {
    stats,
    points: calculatePoints(stats, player.pos)
  };
  player.total = {
    stats,
    points: calculatePoints(stats, player.pos)
  };
  player.name = player.player || `${player.sName}, ${player.fName}`;
  player.club = player.club || player.tName;
  return player;
};

export const importPlayers = () => (
  Object.keys(playersJson).map((key) => {
    const player = importToStats(playersJson[key]);
    const newPlayer = new Player(player);
    return newPlayer.save();
  })
);
