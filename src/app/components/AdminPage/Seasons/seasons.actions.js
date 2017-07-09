import debug from 'debug';

import { fetch } from '../../../utils/index';

export const FETCH_SEASONS = 'FETCH_SEASONS';
export const ADD_SEASON = 'ADD_SEASON';
export const ADD_DIVISION = 'ADD_DIVISION';
export const UPDATE_SEASON = 'UPDATE_SEASON';
export const SAVE_GAME_WEEK_STATS = 'SAVE_GAME_WEEK_STATS';
export const FETCH_EXTERNAL_STATS = 'FETCH_EXTERNAL_STATS';
export const FETCH_USERS_WITH_TEAMS = 'FETCH_USERS_WITH_TEAMS';

const log = debug('kammy:admin/season.actions');

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

export function fetchExternalStats({ currentGW, source }) {
  return {
    type: FETCH_EXTERNAL_STATS,
    payload: fetch.graphQL('getExternalStatsQuery', { currentGW, source })
  };
}

export function saveGameWeekStats({ seasonId, update }) {
  return {
    type: SAVE_GAME_WEEK_STATS,
    payload: fetch.graphQL('saveGameWeekStatsMutation', { seasonId, update })
  };
}

export function fetchUsersWithTeams() {
  return {
    type: FETCH_USERS_WITH_TEAMS,
    payload: fetch.graphQL('getUsersWithTeamsQuery')
  };
}
