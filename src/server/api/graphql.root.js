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

const getStats = async ({ currentGW, source }) => {
  const stats = {};
  if (source === 'internal') {
    const players = await json.get(`${config.INTERNAL_STATS_URL}/stats-GW${currentGW}.json`); // eslint-disable-line
    Object.keys(players).forEach((key) => {
      stats[key] = importToStats(players[key], true);
    });
  } else {
    const data = await json.get(config.EXTERNAL_STATS_URL); // eslint-disable-line
    const dbPlayers = await getPlayers();
    data.players.forEach((player) => {
      const dbPlayer = dbPlayers.find((dbPlyr) => dbPlyr.code === player.id);
      if (!dbPlayer) {
        // todo: show admin user error
        console.log(`not found ${player.id} ${player.sName}, ${player.fName}`); // eslint-disable-line
      } else {
        player.pos = dbPlayer.pos;
        stats[dbPlayer.name] = importToStats(player);
      }
    });
  }
  return { stats };
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
