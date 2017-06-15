/* eslint-disable no-confusing-arrow */
import { findOneUser, addUser, getUsersWithTeams } from './db/user/user.actions';
import { findPlayers, findPlayer, updatePlayers, importPlayers } from './db/player/player.actions';
import { updateTeam, getTeams, getTeam, assignTeamToLeague } from './db/team/team.actions';
import { getSeasons, addLeague, addSeason, updateSeason } from './db/season/season.actions';

const stats = require('../../assets/2016-2017/stats-GW1.json');

const getUser = ({ email, _id }) => findOneUser({ _id, email });
const getPlayers = ({ player }) => player ? findPlayer({ player }) : findPlayers();
const getDashboard = (args, context) => (context.user)
    ? ({ message: "You're authorized to see this secret message." })
    : ({ message: 'default message' });

const getStats = ({ source }) => ({ source, stats });

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
