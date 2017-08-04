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
  'season.points': { $add: ['$season.points', '$gameWeek.points'] },
  'season.apps': { $add: ['$season.apps', '$gameWeek.apps'] },
  'season.mom': { $add: ['$season.mom', '$gameWeek.mom'] },
  'season.subs': { $add: ['$season.subs', '$gameWeek.subs'] },
  'season.gls': { $add: ['$season.gls', '$gameWeek.gls'] },
  'season.asts': { $add: ['$season.asts', '$gameWeek.asts'] },
  'season.ycard': { $add: ['$season.ycard', '$gameWeek.ycard'] },
  'season.rcard': { $add: ['$season.rcard', '$gameWeek.rcard'] },
  'season.tb': { $add: ['$season.tb', '$gameWeek.tb'] },
  'season.sb': { $add: ['$season.sb', '$gameWeek.sb'] },
  'season.cs': { $add: ['$season.cs', '$gameWeek.cs'] },
  'season.con': { $add: ['$season.con', '$gameWeek.con'] },
  'season.pensv': { $add: ['$season.pensv', '$gameWeek.pensv'] },
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
      if (player.pos === 'unknown' && maybeGK) player.pos = 'GK';
      player.new = true;
      player.season = zeros;
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
