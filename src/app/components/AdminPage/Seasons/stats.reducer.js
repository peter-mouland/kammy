import debug from 'debug';

import * as actions from './stats.actions';

const log = debug('kammy:reducers/stats');

export default function stats(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.SAVE_GAME_WEEK_STATS}_PENDING`:
      return {
        ...state,
        saving: true,
        saved: false,
        errors: [],
      };
    case `${actions.FETCH_EXTERNAL_STATS}_PENDING`:
      return {
        ...state,
        loading: true,
        errors: [],
      };
    case `${actions.SAVE_SEASON_STATS}_PENDING`:
      return {
        ...state,
        seasonSaving: true,
        errors: [],
      };
    case `${actions.SAVE_GAME_WEEK_STATS}_FULFILLED`:
      return {
        ...state,
        saving: false,
        saved: true,
        errors: action.payload.errors,
        data: data.saveGameWeekStats && data.saveGameWeekStats.stats,
      };
    case `${actions.SAVE_SEASON_STATS}_FULFILLED`:
      return {
        ...state,
        seasonSaving: false,
        errors: action.payload.errors,
        data: data.saveSeasonStats && data.saveSeasonStats.stats,
      };
    case `${actions.FETCH_EXTERNAL_STATS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        errors: action.payload.errors,
        data: data.getExternalStats && data.getExternalStats.stats,
      };
    default:
      return state;
  }
}
