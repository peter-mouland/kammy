/* eslint-disable no-confusing-arrow */
import debug from 'debug';
import mongoose from 'mongoose';

import { mapImportToSchema, mapSkyFormatToSchema, zeros } from '../../../utils/mapDataImportFormats';
import { json } from '../../../../app/utils/fetch';
import config from '../../../../config/config';

const playersJson = require('../../../../assets/2016-2017/stats-GW25.json');

const log = debug('kammy:db/player.actions');
const Player = mongoose.model('Player');

const aggFields = {
  'season.points.total': { $add: ['$season.points.total', '$gameWeek.points.total'] },
  'season.points.apps': { $add: ['$season.points.apps', '$gameWeek.points.apps'] },
  'season.points.mom': { $add: ['$season.points.mom', '$gameWeek.points.mom'] },
  'season.points.subs': { $add: ['$season.points.subs', '$gameWeek.points.subs'] },
  'season.points.gls': { $add: ['$season.points.gls', '$gameWeek.points.gls'] },
  'season.points.asts': { $add: ['$season.points.asts', '$gameWeek.points.asts'] },
  'season.points.ycard': { $add: ['$season.points.ycard', '$gameWeek.points.ycard'] },
  'season.points.rcard': { $add: ['$season.points.rcard', '$gameWeek.points.rcard'] },
  'season.points.cs': { $add: ['$season.points.cs', '$gameWeek.points.cs'] },
  'season.points.con': { $add: ['$season.points.con', '$gameWeek.points.con'] },
  'season.points.pensv': { $add: ['$season.points.pensv', '$gameWeek.points.pensv'] },
  'season.stats.apps': { $add: ['$season.stats.apps', '$gameWeek.stats.apps'] },
  'season.stats.mom': { $add: ['$season.stats.mom', '$gameWeek.stats.mom'] },
  'season.stats.subs': { $add: ['$season.stats.subs', '$gameWeek.stats.subs'] },
  'season.stats.gls': { $add: ['$season.stats.gls', '$gameWeek.stats.gls'] },
  'season.stats.asts': { $add: ['$season.stats.asts', '$gameWeek.stats.asts'] },
  'season.stats.ycard': { $add: ['$season.stats.ycard', '$gameWeek.stats.ycard'] },
  'season.stats.rcard': { $add: ['$season.stats.rcard', '$gameWeek.stats.rcard'] },
  'season.stats.cs': { $add: ['$season.stats.cs', '$gameWeek.stats.cs'] },
  'season.stats.con': { $add: ['$season.stats.con', '$gameWeek.stats.con'] },
  'season.stats.pensv': { $add: ['$season.stats.pensv', '$gameWeek.stats.pensv'] },
  gameWeek: 1,
  name: 1,
  code: 1,
  club: 1,
  pos: 1,
  isHidden: 1
};

export const getPlayers = (playerDetails = {}) =>
  Player.aggregate({ $match: playerDetails }, { $project: aggFields }).exec();

export const updatePlayers = ({ playerUpdates }) => {
  const bulkUpdate = playerUpdates.map((update) => {
    update.new = false;
    return {
      updateOne: {
        filter: { _id: update._id }, update
      },
    };
  });
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
    const dbPlayer = await getPlayers({ code: formattedSkyPlayer.code });
    formattedSkyPlayer.pos = dbPlayer ? dbPlayer.pos : formattedJsonPlayer.pos || 'unknown';
    const maybeGK = String(formattedSkyPlayer.code).startsWith('1');
    const maybeStr = String(formattedSkyPlayer.code).startsWith('4');
    if (formattedSkyPlayer.pos === 'park') formattedSkyPlayer.pos = 'unknown';
    if (formattedSkyPlayer.pos === 'unknown' && maybeGK) formattedSkyPlayer.pos = 'GK';
    if (formattedSkyPlayer.pos === 'unknown' && maybeStr) formattedSkyPlayer.pos = 'STR';
    if (!dbPlayer) {
      formattedSkyPlayer.new = true;
      formattedSkyPlayer.season.stats = zeros;
      updatePromises.push((new Player(formattedSkyPlayer)).save());
    } else {
      delete formattedSkyPlayer.season;
      delete formattedSkyPlayer.gameWeek;
      updatePromises.push((Player.findByIdAndUpdate(dbPlayer._id, formattedSkyPlayer)).exec());
    }
    stats[formattedSkyPlayer.name] = formattedSkyPlayer;
  });
  return Promise.all(updatePromises).catch(log);
};
