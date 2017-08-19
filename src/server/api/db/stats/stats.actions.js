import mongoose from 'mongoose';
import debug from 'debug';

import { getPlayers } from '../player/player.actions';
import config from '../../../../config/config';
import { json } from '../../../../app/utils/fetch';
import { mapSkyFormatToSchema, mapImportToSkyFormat } from '../../../utils/mapDataImportFormats';
import { calculatePoints } from '../../../utils/calculatePoints';

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
      [`gameWeek.${position}`]: player.gameWeek.points
    });

    allUpdates.push(Player.findOneAndUpdate(
      { code: player.code },
      { $set: {
        gameWeek: player.gameWeek,
      } }
    ));
    allUpdates.push(Team.update(queryTeam('sub'), { $set: setTeam('sub') }, { multi: true }));
    allUpdates.push(Team.update(queryTeam(`${pos}`), { $set: setTeam(`${pos}`) }, { multi: true }));
    allUpdates.push(Team.update(queryTeam(`${pos}left`), { $set: setTeam(`${pos}left`) }, { multi: true }));
    allUpdates.push(Team.update(queryTeam(`${pos}right`), { $set: setTeam(`${pos}right`) }, { multi: true }));
  });
  return Promise.all(allUpdates).then(() => update);
};


export const saveSeasonStats = async ({ seasonId }) => {
  const allUpdates = [];
  const players = await Player.find().exec();
  players.forEach(async (player) => {
    const pos = player.pos.toLowerCase();
    const season = player.season;
    const gameWeek = player.gameWeek;
    allUpdates.push(Player.findOneAndUpdate(
      { code: player.code },
      { $set: {
        'season.points': season.points + gameWeek.points,
        'season.pensv': season.pensv + gameWeek.pensv,
        'season.apps': season.apps + gameWeek.apps,
        'season.subs': season.subs + gameWeek.subs,
        'season.gls': season.gls + gameWeek.gls,
        'season.asts': season.asts + gameWeek.asts,
        'season.con': season.con + gameWeek.con,
        'season.cs': season.cs + gameWeek.cs,
        'season.rcard': season.rcard + gameWeek.rcard,
        'season.ycard': season.ycard + gameWeek.ycard,
        'season.tb': season.tb + gameWeek.tb,
        'season.sb': season.sb + gameWeek.sb,
        'gameWeek.points': 0,
        'gameWeek.pensv': 0,
        'gameWeek.apps': 0,
        'gameWeek.subs': 0,
        'gameWeek.gls': 0,
        'gameWeek.asts': 0,
        'gameWeek.con': 0,
        'gameWeek.cs': 0,
        'gameWeek.rcard': 0,
        'gameWeek.ycard': 0,
        'gameWeek.tb': 0,
        'gameWeek.sb': 0,
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
        [`season.${position}`]: team.season[position] + player.gameWeek.points,
        [`gameWeek.${position}`]: 0,
      });
      allUpdates.push(Team.update(queryTeam('sub'), { $set: setTeam('sub') }, { multi: true }).exec());
      allUpdates.push(Team.update(queryTeam(`${pos}`), { $set: setTeam(`${pos}`) }, { multi: true }).exec());
      allUpdates.push(Team.update(queryTeam(`${pos}left`), { $set: setTeam(`${pos}left`) }, { multi: true }).exec());
      allUpdates.push(Team.update(queryTeam(`${pos}right`), { $set: setTeam(`${pos}right`) }, { multi: true }).exec());
    });
  });
  return Promise.all(allUpdates);
};
