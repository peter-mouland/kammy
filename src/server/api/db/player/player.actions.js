/* eslint-disable no-confusing-arrow */
import debug from 'debug';
import mongoose from 'mongoose';

import { mapImportToSchema, mapSkyFormatToSchema, zeros } from '../../../utils/mapDataImportFormats';
import { json } from '../../../../app/utils/fetch';
import config from '../../../../config/config';

const playersJson = require('../../../../assets/ff-1718.json');

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
  value: 1,
  new: 1,
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
  const dbPlayers = (await getPlayers());
  const players = dbPlayers.reduce((prev, player) => ({ ...prev, [player.code]: player }), {});
  skyPlayers.forEach((skyPlayer) => {
    const player = mapSkyFormatToSchema(skyPlayer);
    const jsonPlayer = playersJson[player.name];
    const dbPlayer = players[player.code];
    const formattedJsonPlayer = jsonPlayer ? mapImportToSchema(jsonPlayer) : {};
    player.pos = dbPlayer ? dbPlayer.pos : formattedJsonPlayer.pos || 'unknown';
    if (player.pos === 'park') player.pos = 'unknown';
    if (!dbPlayer) {
      const maybeGK = String(player.code).startsWith('1');
      const maybeStr = String(player.code).startsWith('4');
      if (player.pos === 'unknown' && maybeGK) player.pos = 'GK';
      if (player.pos === 'unknown' && maybeStr) player.pos = 'STR';
      player.new = true;
      player.season.stats = zeros;
      updatePromises.push((new Player(player)).save());
    } else {
      delete player.season;
      delete player.gameWeek;
      player.new = false;
      updatePromises.push((Player.findByIdAndUpdate(dbPlayer._id, player)).exec());
    }
    stats[player.name] = player;
  });
  return Promise.all(updatePromises).catch(log);
};
