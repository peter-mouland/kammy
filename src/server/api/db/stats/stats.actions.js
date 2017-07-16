import mongoose from 'mongoose';
import debug from 'debug';

import { getPlayers } from '../player/player.actions';
import config from '../../../../config/config';
import { json } from '../../../../app/utils/fetch';
import { mapSkyFormatToSchema, mapImportToSkyFormat } from '../../../utils/mapDataImportFormats';
import { calculatePoints } from '../../../utils/calculatePoints';

const Season = mongoose.model('Season');
const Player = mongoose.model('Player');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;
const log = debug('kammy:stats.action');

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
      stats[dbPlayer.name] = calculatePoints(formattedPlayer, dbPlayer.total, currentGW);
    }
  });
  return { stats, errors };
};

export const saveGameWeekStats = ({ seasonId, update }) => {
  const allUpdates = [];
  (Object.keys(update)).forEach((key) => {
    const player = update[key];
    const pos = player.pos.toLowerCase();
    const queryTeam = (position) => ({
      'season._id': new ObjectId(seasonId),
      [`${position}.code`]: player.code
    });
    const setTeam = (position) => ({
      [`gameWeek.${position}`]: player.gameWeek.points.total
    });

    allUpdates.push(Player.findOneAndUpdate(
      { code: player.code },
      { $set: {
        'gameWeek.points': player.gameWeek.points,
        'gameWeek.stats': player.gameWeek.stats,
      } }
    ));
    allUpdates.push(Team.update(queryTeam('sub'), { $set: setTeam('sub') }));
    allUpdates.push(Team.update(queryTeam(`${pos}`), { $set: setTeam(`${pos}`) }));
    allUpdates.push(Team.update(queryTeam(`${pos}left`), { $set: setTeam(`${pos}left`) }));
    allUpdates.push(Team.update(queryTeam(`${pos}right`), { $set: setTeam(`${pos}right`) }));
  });
  return Promise.all(allUpdates).then(() => update);
};


export const saveSeasonStats = async ({ seasonId, currentGW }) => {
  const allUpdates = [];
  const players = await Player.find().exec();
  allUpdates.push(Season.findByIdAndUpdate(seasonId, { currentGW }, { new: true }).exec());
  players.forEach((player) => {
    const pos = player.pos.toLowerCase();
    allUpdates.push(Player.findOneAndUpdate(
      { code: player.code },
      { $set: {
        'total.points.pensv': player.total.points.pensv + player.gameWeek.points.pensv,
        'total.points.apps': player.total.points.apps + player.gameWeek.points.apps,
        'total.points.subs': player.total.points.subs + player.gameWeek.points.subs,
        'total.points.gls': player.total.points.gls + player.gameWeek.points.gls,
        'total.points.asts': player.total.points.asts + player.gameWeek.points.asts,
        'total.points.con': player.total.points.con + player.gameWeek.points.con,
        'total.points.cs': player.total.points.cs + player.gameWeek.points.cs,
        'total.points.rcard': player.total.points.rcard + player.gameWeek.points.rcard,
        'total.points.ycard': player.total.points.ycard + player.gameWeek.points.ycard,
        'total.stats.pensv': player.total.stats.pensv + player.gameWeek.stats.pensv,
        'total.stats.apps': player.total.stats.apps + player.gameWeek.stats.apps,
        'total.stats.subs': player.total.stats.subs + player.gameWeek.stats.subs,
        'total.stats.gls': player.total.stats.gls + player.gameWeek.stats.gls,
        'total.stats.asts': player.total.stats.asts + player.gameWeek.stats.asts,
        'total.stats.con': player.total.stats.con + player.gameWeek.stats.con,
        'total.stats.cs': player.total.stats.cs + player.gameWeek.stats.cs,
        'total.stats.rcard': player.total.stats.rcard + player.gameWeek.stats.rcard,
        'total.stats.ycard': player.total.stats.ycard + player.gameWeek.stats.ycard,
        'gameWeek.points.pensv': 0,
        'gameWeek.points.apps': 0,
        'gameWeek.points.subs': 0,
        'gameWeek.points.gls': 0,
        'gameWeek.points.asts': 0,
        'gameWeek.points.con': 0,
        'gameWeek.points.cs': 0,
        'gameWeek.points.rcard': 0,
        'gameWeek.points.ycard': 0,
        'gameWeek.stats.pensv': 0,
        'gameWeek.stats.apps': 0,
        'gameWeek.stats.subs': 0,
        'gameWeek.stats.gls': 0,
        'gameWeek.stats.asts': 0,
        'gameWeek.stats.con': 0,
        'gameWeek.stats.cs': 0,
        'gameWeek.stats.rcard': 0,
        'gameWeek.stats.ycard': 0,
      } }
    ));
    const queryTeam = (position) => ({
      'season._id': new ObjectId(seasonId),
      [`${position}.code`]: player.code
    });
    Team.find(queryTeam(pos)).exec().then((teams) => {
      teams.forEach((team) => {
        const setTeam = (position) => ({
          [`total.${position}`]: team.total[pos] + player.gameWeek.points.total,
          [`gameWeek.${position}`]: 0,
        });
        allUpdates.push(Team.update(queryTeam('sub'), { $set: setTeam('sub') }));
        allUpdates.push(Team.update(queryTeam(`${pos}`), { $set: setTeam(`${pos}`) }));
        allUpdates.push(Team.update(queryTeam(`${pos}left`), { $set: setTeam(`${pos}left`) }));
        allUpdates.push(Team.update(queryTeam(`${pos}right`), { $set: setTeam(`${pos}right`) }));
      });
    });
  });
  return Promise.all(allUpdates); // .then(log);
};
