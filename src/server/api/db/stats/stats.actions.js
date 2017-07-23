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
      stats[dbPlayer.name] = calculatePoints(formattedPlayer, dbPlayer);
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
  players.forEach(async (player) => {
    const pos = player.pos.toLowerCase();
    const seasonStats = player.season.stats;
    const seasonPoints = player.season.points;
    const gwStats = player.gameWeek.stats;
    const gwPoints = player.gameWeek.points;
    allUpdates.push(Player.findOneAndUpdate(
      { code: player.code },
      { $set: {
        'season.points.pensv': seasonPoints.pensv + gwPoints.pensv,
        'season.points.apps': seasonPoints.apps + gwPoints.apps,
        'season.points.subs': seasonPoints.subs + gwPoints.subs,
        'season.points.gls': seasonPoints.gls + gwPoints.gls,
        'season.points.asts': seasonPoints.asts + gwPoints.asts,
        'season.points.con': seasonPoints.con + gwPoints.con,
        'season.points.cs': seasonPoints.cs + gwPoints.cs,
        'season.points.rcard': seasonPoints.rcard + gwPoints.rcard,
        'season.points.ycard': seasonPoints.ycard + gwPoints.ycard,
        'season.points.total': seasonPoints.total + gwPoints.total,
        'season.stats.pensv': seasonStats.pensv + gwStats.pensv,
        'season.stats.apps': seasonStats.apps + gwStats.apps,
        'season.stats.subs': seasonStats.subs + gwStats.subs,
        'season.stats.gls': seasonStats.gls + gwStats.gls,
        'season.stats.asts': seasonStats.asts + gwStats.asts,
        'season.stats.con': seasonStats.con + gwStats.con,
        'season.stats.cs': seasonStats.cs + gwStats.cs,
        'season.stats.rcard': seasonStats.rcard + gwStats.rcard,
        'season.stats.ycard': seasonStats.ycard + gwStats.ycard,
        'gameWeek.points.total': 0,
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
    const teams = await Team.find(queryTeam(pos)).exec();
    const teamsSub = await Team.find(queryTeam('sub')).exec();
    const teamsLeft = await Team.find(queryTeam(`${pos}left`)).exec();
    const teamsRight = await Team.find(queryTeam(`${pos}right`)).exec();
    const allTeams = (teams.concat(teamsSub).concat(teamsLeft).concat(teamsRight));

    allTeams.forEach((team) => {
      const setTeam = (position) => ({
        [`season.${position}`]: team.season[position] + player.gameWeek.points.total,
        [`gameWeek.${position}`]: 0,
      });
      allUpdates.push(Team.update(queryTeam('sub'), { $set: setTeam('sub') }));
      allUpdates.push(Team.update(queryTeam(`${pos}`), { $set: setTeam(`${pos}`) }));
      allUpdates.push(Team.update(queryTeam(`${pos}left`), { $set: setTeam(`${pos}left`) }));
      allUpdates.push(Team.update(queryTeam(`${pos}right`), { $set: setTeam(`${pos}right`) }));
    });
  });
  return Promise.all(allUpdates);
};
