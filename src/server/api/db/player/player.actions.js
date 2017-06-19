/* eslint-disable no-confusing-arrow */
import debug from 'debug';
import mongoose from 'mongoose';

const playersJson = require('../../../../assets/2016-2017/stats-GW25.json');
const { mapImportToSchema } = require('../../../utils/mapDataImportFormats');

const log = debug('kammy:db/player.actions');
const Player = mongoose.model('Player');

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

// initial import only
export const importPlayers = () => (
  (Object.keys(playersJson)).map((key) => {
    const formattedPlayer = mapImportToSchema(playersJson[key]);
    const newPlayer = new Player(formattedPlayer);
    return newPlayer.save();
  })
);

export const getPlayers = ({ player } = {}) => player ? findPlayer({ player }) : findPlayers();
