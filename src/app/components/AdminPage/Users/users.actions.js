import debug from 'debug';

import { fetch } from '../../../utils/index';

export const FETCH_TEAMS = 'FETCH_TEAMS';
export const FETCH_USERS_WITH_TEAMS = 'FETCH_USERS_WITH_TEAMS';
export const FETCH_PLAYERS = 'FETCH_PLAYERS';
export const ADD_USER = 'ADD_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const IMPORT_PLAYERS = 'IMPORT_PLAYERS';
export const UPDATE_PLAYERS = 'UPDATE_PLAYERS';
export const UPDATE_TEAM = 'UPDATE_TEAM';

const log = debug('kammy:actions');

export function addUser(userDetails) {
  return {
    type: ADD_USER,
    payload: fetch.graphQL('addUserMutation', userDetails)
  };
}

export function updateUser(userDetails) {
  return {
    type: UPDATE_USER,
    payload: fetch.graphQL('updateUserMutation', userDetails)
  };
}

export function updateTeam(teamUpdate) {
  return {
    type: UPDATE_TEAM,
    payload: fetch.graphQL('updateTeamMutation', { teamUpdate })
  };
}

export function fetchUsersWithTeams() {
  return {
    type: FETCH_USERS_WITH_TEAMS,
    payload: fetch.graphQL('getUsersWithTeamsQuery')
  };
}
