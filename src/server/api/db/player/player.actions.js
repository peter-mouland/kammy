/* eslint-disable no-confusing-arrow */
import debug from 'debug';
import mongoose from 'mongoose';

import { mapImportToSchema, mapSkyFormatToSchema } from '../../../utils/mapDataImportFormats';
import { json } from '../../../../app/utils/fetch';
import config from '../../../../config/config';

const playersJson = require('../../../../assets/2016-2017/stats-GW25.json');

const log = debug('kammy:db/player.actions');
const Player = mongoose.model('Player');

export const findPlayers = (players = {}) => Player.find(players).exec();
export const findPlayer = (playerDetails) => Player.findOne(playerDetails).exec();
export const getPlayers = ({ player } = {}) => player ? findPlayer({ player }) : findPlayers();

export const updatePlayers = ({ playerUpdates }) => {
  const bulkUpdate = playerUpdates.map((update) => ({
    updateOne: {
      filter: { _id: update._id }, update
    },
  }));
  return Player.bulkWrite(bulkUpdate).then(() => (playerUpdates));
};

export const importPlayers = async () => {
  const stats = {};
  const updatePromises = [];
  const skyPlayers = (await json.get(config.EXTERNAL_STATS_URL)).players;
  skyPlayers.forEach(async (skyPlayer) => {
    const formattedSkyPlayer = mapSkyFormatToSchema(skyPlayer);
    const jsonPlayer = playersJson[formattedSkyPlayer.name];
    const formattedJsonPlayer = jsonPlayer ? mapImportToSchema(jsonPlayer) : {};
    const dbPlayer = await findPlayer({ code: formattedSkyPlayer.code });
    formattedSkyPlayer.pos = dbPlayer ? dbPlayer.pos : formattedJsonPlayer.pos || 'unknown';
    if (formattedSkyPlayer.pos === 'park') formattedSkyPlayer.pos = 'unknown';
    if (!dbPlayer) {
      updatePromises.push((new Player(formattedSkyPlayer)).save());
    } else {
      updatePromises.push((Player.findByIdAndUpdate(dbPlayer._id, formattedSkyPlayer)).exec());
    }

    stats[formattedSkyPlayer.name] = formattedSkyPlayer;
  });
  return Promise.all(updatePromises).catch(log);
};
