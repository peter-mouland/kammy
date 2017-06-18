/* eslint-disable no-confusing-arrow */
import { findOneUser, addUser, getUsersWithTeams } from './db/user/user.actions';
import {
  findPlayers, findPlayer, updatePlayers, importPlayers, importToStats
} from './db/player/player.actions';
import { updateTeam, getTeams, getTeam, assignTeamToLeague } from './db/team/team.actions';
import { getSeasons, addLeague, addSeason, updateSeason } from './db/season/season.actions';
import config from '../../config/config';
import { json } from '../../app/utils/fetch';

const getUser = ({ email, _id }) => findOneUser({ _id, email });
const getPlayers = ({ player } = {}) => player ? findPlayer({ player }) : findPlayers();
const getDashboard = (args, context) => (context.user)
    ? ({ message: "You're authorized to see this secret message." })
    : ({ message: 'default message' });

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
      delete stats[dbPlayer.name].stats;
    }
  });
  return { stats, errors };
};

const mapImportToSkyFormat = (player) => {
  player.id = player.code;
  player.stats = {
    season: [
      player.apps,
      player.mom,
      player.subs,
      player.gls,
      player.asts,
      player.ycard,
      player.rcard,
      player.cs,
      player.con,
      null,
      null,
      player.pensv
    ] };
  return player;
};

const getStats = async ({ currentGW, source }) => {
  const data = (source === 'internal')
    ? (await json.get(`${config.INTERNAL_STATS_URL}/stats-GW${currentGW}.json`)) // eslint-disable-line
    : (await json.get(config.EXTERNAL_STATS_URL)).players;
  const players = (Array.isArray(data))
    ? data
    : (Object.keys(data)).map((key) => mapImportToSkyFormat(data[key]));
  return calculateImport(players, currentGW);
};


// The root provides the top-level API endpoints
export default {
  getStats,
  getPlayers,
  importPlayers,
  updatePlayers,
  getSeasons,
  addSeason,
  updateSeason,
  addLeague,
  assignTeamToLeague,
  getTeams,
  getTeam,
  updateTeam,
  getUsersWithTeams,
  getUser,
  addUser,
  getDashboard,
};
