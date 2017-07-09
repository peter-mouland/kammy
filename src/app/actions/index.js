import debug from 'debug';

import { fetch } from '../utils';
import Auth from '../authentication/auth-helper';

export const FETCH_DIVISIONS = 'FETCH_DIVISIONS';
export const FETCH_STATS = 'FETCH_STATS';
export const FETCH_TEAM = 'FETCH_TEAM';
export const FETCH_TEAMS = 'FETCH_TEAMS';
export const FETCH_USERS_WITH_TEAMS = 'FETCH_USERS_WITH_TEAMS';
export const FETCH_SEASONS = 'FETCH_SEASONS';
export const FETCH_PLAYERS = 'FETCH_PLAYERS';
export const FETCH_DASHBOARD_DATA = 'FETCH_DASHBOARD_DATA';
export const ADD_SEASON = 'ADD_SEASON';
export const ADD_DIVISION = 'ADD_DIVISION';
export const ADD_USER = 'ADD_USER';
export const IMPORT_PLAYERS = 'IMPORT_PLAYERS';
export const UPDATE_PLAYERS = 'UPDATE_PLAYERS';
export const UPDATE_TEAM = 'UPDATE_TEAM';
export const UPDATE_SEASON = 'UPDATE_SEASON';
export const SAVE_GAME_WEEK_STATS = 'UPDATE_GAME_WEEK_STATS';
export const ASSIGN_TEAM_TO_DIVISION = 'ASSIGN_TEAM_TO_DIVISION';

const log = debug('kammy:actions');

export function fetchDivisions() {
  return {
    type: FETCH_DIVISIONS,
    payload: fetch.graphQL('getDivisionsQuery', {})
  };
}

export function fetchStats({ currentGW, source }) {
  return {
    type: FETCH_STATS,
    payload: fetch.graphQL('getStatsQuery', { currentGW, source })
  };
}

export function fetchPlayers(player) {
  return {
    type: FETCH_PLAYERS,
    payload: fetch.graphQL('getPlayersQuery', player ? { player } : undefined)
  };
}

export function importPlayers() {
  return {
    type: IMPORT_PLAYERS,
    payload: fetch.graphQL('importPlayersMutation')
  };
}

export function fetchTeam({ teamId = Auth.user().defaultTeamId } = {}) {
  return {
    type: FETCH_TEAM,
    payload: fetch.graphQL('getTeamQuery', { teamId })
  };
}

export function fetchTeams() {
  return {
    type: FETCH_TEAMS,
    payload: fetch.graphQL('getTeamsQuery')
  };
}

export function fetchUsersWithTeams() {
  return {
    type: FETCH_USERS_WITH_TEAMS,
    payload: fetch.graphQL('getUsersWithTeamsQuery')
  };
}

export function fetchDashboardData() {
  return {
    type: FETCH_DASHBOARD_DATA,
    payload: fetch.graphQL('getDashboardQuery')
  };
}

export function fetchSeasons() {
  return {
    type: FETCH_SEASONS,
    payload: fetch.graphQL('getSeasonsQuery')
  };
}

export function addSeason(name) {
  return {
    type: ADD_SEASON,
    payload: fetch.graphQL('addSeasonsMutation', { name })
  };
}

export function addDivision(seasonId, name) {
  return {
    type: ADD_DIVISION,
    meta: { seasonId },
    payload: fetch.graphQL('addDivisionsMutation', { seasonId, name })
  };
}

export function updateSeason({ seasonId, ...update }) {
  return {
    type: UPDATE_SEASON,
    payload: fetch.graphQL('updateSeasonMutation', { seasonId, ...update })
  };
}

export function assignTeamToDivision({ divisionId, divisionName, teamId }) {
  return {
    type: ASSIGN_TEAM_TO_DIVISION,
    payload: fetch.graphQL('assignTeamToDivisionMutation', { divisionId, divisionName, teamId })
  };
}

export function addUser(userDetails) {
  return {
    type: ADD_USER,
    payload: fetch.graphQL('addUserMutation', userDetails)
  };
}

export function updatePlayers(playerUpdates) {
  return {
    type: UPDATE_PLAYERS,
    payload: fetch.graphQL('updatePlayersMutation', playerUpdates)
  };
}

export function updateTeam(teamUpdate) {
  return {
    type: UPDATE_TEAM,
    payload: fetch.graphQL('updateTeamMutation', { teamUpdate })
  };
}

export function saveGameWeekStats({ seasonId, update }) {
  return {
    type: SAVE_GAME_WEEK_STATS,
    payload: fetch.graphQL('saveGameWeekStatsMutation', { seasonId, update })
  };
}
