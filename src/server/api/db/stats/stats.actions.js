import mongoose from 'mongoose';

import { getPlayers, importToStats, mapImportToSkyFormat } from '../player/player.actions';
import config from '../../../../config/config';
import { json } from '../../../../app/utils/fetch';

const Player = mongoose.model('Player');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

const calculateImport = async (players) => {
  const dbPlayers = await getPlayers();
  const stats = {};
  const errors = [];
  players.forEach((player) => {
    const dbPlayer = dbPlayers.find((dbPlyr) => dbPlyr.code === (player.id || player.code));
    if (!dbPlayer) {
      errors.push({ message: `not found ${player.id} ${player.sName}, ${player.fName}`, player });
    } else {
      player.pos = dbPlayer.pos;
      stats[dbPlayer.name] = importToStats(player, dbPlayer.total.stats);
      delete stats[dbPlayer.name].id;
      delete stats[dbPlayer.name].new;
      delete stats[dbPlayer.name].player_2;
      delete stats[dbPlayer.name].apps;
      delete stats[dbPlayer.name].subs;
      delete stats[dbPlayer.name].gls;
      delete stats[dbPlayer.name].asts;
      delete stats[dbPlayer.name].mom;
      delete stats[dbPlayer.name].cs;
      delete stats[dbPlayer.name].con;
      delete stats[dbPlayer.name].pensv;
      delete stats[dbPlayer.name].ycard;
      delete stats[dbPlayer.name].rcard;
      delete stats[dbPlayer.name].change;
      delete stats[dbPlayer.name].player;
      delete stats[dbPlayer.name].gw0;
      delete stats[dbPlayer.name].gw1;
      delete stats[dbPlayer.name].stats;
    }
  });
  return { stats, errors };
};

export const getStats = async ({ currentGW, source }) => {
  const data = (source === 'internal')
    ? (await json.get(`${config.INTERNAL_STATS_URL}/stats-GW${currentGW}.json`)) // eslint-disable-line
    : (await json.get(config.EXTERNAL_STATS_URL)).players;
  const players = (Array.isArray(data))
    ? data
    : (Object.keys(data)).map((key) => mapImportToSkyFormat(data[key]));
  return calculateImport(players, currentGW);
};

export const updateStats = ({ seasonId, update }) => {
  const allUpdates = (Object.keys(update)).map((key) => {
    const player = update[key];
    const pos = player.pos.toLowerCase();
    return Promise.resolve()
      .then(() => Player.findOneAndUpdate({ code: player.code }, { $set: player }))
      .then(() => Team.update(
        {
          'season._id': new ObjectId(seasonId),
          [`${pos}.code`]: player.code
        },
        {
          $set: {
            'gameWeek.points': player.gameWeek.points.total,
            [`gameWeek.${pos}`]: player.gameWeek.points.total
          },
          $inc: {
            'total.points': player.gameWeek.points.total,
            [`total.${pos}`]: player.gameWeek.points.total
          },
        }
      ));
  });
  return Promise.all(allUpdates).then(() => update);
};
