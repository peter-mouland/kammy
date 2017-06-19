/* eslint-disable no-confusing-arrow */
import debug from 'debug';
import mongoose from 'mongoose';

const playersJson = require('../../../../assets/2016-2017/stats-GW25.json');
const { calculatePoints, calculateGameWeek } = require('../../../utils/calculatePoints');

const log = debug('kammy:db/player.actions');
const Player = mongoose.model('Player');
const mapper = () => ({
  STARTING_XI: 0,
  MAN_OF_MATCH: 1,
  SUBS: 2,
  GOALS: 3,
  ASSISTS: 4,
  YELLOW_CARDS: 5,
  RED_CARDS: 6,
  CLEAN_SHEETS: 7,
  CONCEDED: 8,
  SAVED_PENALTIES: 11
});

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

export const mapImportToSkyFormat = (player) => {
  player.id = player.code;
  player.stats = {
    season: [
      player.apps,
      player.mom,
      player.subs,
      player.gls,
      player.asts,
      player.ycard,
      player.rcard,
      player.cs,
      player.con,
      null,
      null,
      player.pensv
    ] };
  return player;
};

export const importToStats = (player, previousStats) => {
  const map = mapper();
  const season = player.stats && player.stats.season;

  const stats = {
    apps: season[map.STARTING_XI],
    mom: season[map.MAN_OF_MATCH],
    subs: season[map.SUBS],
    gls: season[map.GOALS],
    asts: season[map.ASSISTS],
    cs: season[map.CLEAN_SHEETS],
    con: season[map.CONCEDED],
    pensv: season[map.SAVED_PENALTIES],
    ycard: season[map.YELLOW_CARDS],
    rcard: season[map.RED_CARDS],
  };
  const total = {
    points: calculatePoints(stats, player.pos),
    stats
  };
  player.gameWeek = previousStats ? calculateGameWeek(stats, player.pos, previousStats) : total;
  player.total = total;
  player.name = player.player || `${player.sName}, ${player.fName}`;
  player.club = player.club || player.tName;
  return player;
};

export const importPlayers = () => (
  Object.keys(playersJson).map((key) => {
    const playerWithStats = mapImportToSkyFormat(playersJson[key]);
    playerWithStats.stats.season = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const player = importToStats(playerWithStats);
    const newPlayer = new Player(player);
    return newPlayer.save();
  })
);

export const getPlayers = ({ player } = {}) => player ? findPlayer({ player }) : findPlayers();
