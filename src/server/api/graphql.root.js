/* eslint-disable no-confusing-arrow */
import { getUser, addUser, getUsersWithTeams } from './db/user/user.actions';
import { getPlayers, updatePlayers, importPlayers } from './db/player/player.actions';
import { updateTeam, getTeams, getTeam, assignTeamToLeague } from './db/team/team.actions';
import { getSeasons, addLeague, addSeason, updateSeason } from './db/season/season.actions';
import { getStats, updateStats } from './db/stats/stats.actions';

const getDashboard = (args, context) => (context.user)
    ? ({ message: "You're authorized to see this secret message." })
    : ({ message: 'default message' });

// The root provides the top-level API endpoints
export default {
  getStats,
  updateStats,
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
