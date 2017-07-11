import debug from 'debug';

import * as actions from '../admin-page.actions';

const log = debug('kammy:reducers/stats');

export default function stats(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_EXTERNAL_STATS}_PENDING`:
      return {
        ...state,
        loading: true,
        errors: [],
      };
    case `${actions.FETCH_EXTERNAL_STATS}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data.getExternalStats && data.getExternalStats.stats,
      };
    default:
      return state;
  }
}
