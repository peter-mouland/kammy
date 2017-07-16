import debug from 'debug';

import { fetch } from '../../../utils/index';

export const SAVE_SEASON_STATS = 'SAVE_SEASON_STATS';
export const SAVE_GAME_WEEK_STATS = 'SAVE_GAME_WEEK_STATS';
export const FETCH_EXTERNAL_STATS = 'FETCH_EXTERNAL_STATS';

const log = debug('kammy:admin/stats.actions');

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

export function saveSeasonStats({ seasonId, currentGW }) {
  return {
    type: SAVE_SEASON_STATS,
    payload: fetch.graphQL('saveSeasonStatsMutation', { seasonId, currentGW })
  };
}
