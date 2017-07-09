import debug from 'debug';

import { fetch } from '../../utils/index';

export const FETCH_STATS = 'FETCH_STATS';
export const FETCH_TEAMS = 'FETCH_TEAMS';
export const FETCH_USERS_WITH_TEAMS = 'FETCH_USERS_WITH_TEAMS';
export const FETCH_PLAYERS = 'FETCH_PLAYERS';
export const ADD_USER = 'ADD_USER';
export const IMPORT_PLAYERS = 'IMPORT_PLAYERS';
export const UPDATE_PLAYERS = 'UPDATE_PLAYERS';
export const UPDATE_TEAM = 'UPDATE_TEAM';

const log = debug('kammy:actions');

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

