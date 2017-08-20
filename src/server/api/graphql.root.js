/* eslint-disable no-confusing-arrow */
import { getUser, addUser, updateUser, getUsersWithTeams } from './db/user/user.actions';
import { getPlayers, getPlayerFixtures, updatePlayers, importPlayers } from './db/player/player.actions';
import { updateTeam, getTeams, getTeam, assignTeamToDivision } from './db/team/team.actions';
import { getSeasons, getDivisions, addDivision, addSeason, updateSeason } from './db/season/season.actions';
import { getExternalStats, saveGameWeekStats, saveSeasonStats } from './db/stats/stats.actions';

const getDashboard = (args, context) => (context.user)
  ? ({ message: "You're authorized to see this secret message." })
  : ({ message: 'default message' });

// The root provides the top-level API endpoints
export default {
  getExternalStats,
  saveGameWeekStats,
  saveSeasonStats,
  getPlayers,
  getPlayerFixtures,
  importPlayers,
  updatePlayers,
  getSeasons,
  addSeason,
  updateSeason,
  getDivisions,
  addDivision,
  assignTeamToDivision,
  getTeams,
  getTeam,
  updateTeam,
  getUsersWithTeams,
  getUser,
  addUser,
  updateUser,
  getDashboard,
};
