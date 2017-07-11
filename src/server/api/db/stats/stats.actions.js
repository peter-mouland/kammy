import mongoose from 'mongoose';

import { getPlayers } from '../player/player.actions';
import config from '../../../../config/config';
import { json } from '../../../../app/utils/fetch';
import { mapSkyFormatToSchema, mapImportToSkyFormat } from '../../../utils/mapDataImportFormats';
import { calculatePoints } from '../../../utils/calculatePoints';

const Player = mongoose.model('Player');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

export const getExternalStats = async ({ currentGW, source }) => {
  const dbPlayers = await getPlayers();
  const stats = {};
  const errors = [];
  const data = (source === 'internal')
    ? (await json.get(`${config.INTERNAL_STATS_URL}/stats-GW${currentGW}.json`))
    : (await json.get(config.EXTERNAL_STATS_URL)).players;
  const players = (Array.isArray(data))
    ? data
    : (Object.keys(data)).map((key) => mapImportToSkyFormat(data[key]));
  players.forEach((player) => {
    const dbPlayer = dbPlayers.find((dbPlyr) => dbPlyr.code === (player.id || player.code));
    if (!dbPlayer) {
      errors.push({ message: `not found ${player.id} ${player.sName}, ${player.fName}`, player });
    } else {
      player.pos = dbPlayer.pos;
      const formattedPlayer = mapSkyFormatToSchema(player);
      stats[dbPlayer.name] = calculatePoints(formattedPlayer, dbPlayer.total.stats, currentGW);
    }
  });
  return { stats, errors };
};

export const saveGameWeekStats = ({ seasonId, update }) => {
  const allUpdates = (Object.keys(update)).map((key) => {
    const player = update[key];
    const pos = player.pos.toLowerCase();
    return Promise.resolve()
      .then(() => Player.findOneAndUpdate(
        {
          code: player.code
        },
        {
          $set: {
            'gameWeek.points': player.gameWeek.points,
            'gameWeek.stats': player.gameWeek.stats,
          }
        }
      ))
      .then(() => Team.update(
        {
          'season._id': new ObjectId(seasonId),
          [`${pos}.code`]: player.code
        },
        {
          $set: {
            // 'gameWeek.points': player.gameWeek.points.total,
            [`gameWeek.${pos}`]: player.gameWeek.points.total
          },
          // $inc: {
          //   'total.points': player.gameWeek.points.total,
          //   [`total.${pos}`]: player.gameWeek.points.total
          // },
        }
      ));
  });
  return Promise.all(allUpdates).then(() => update);
};
