import debug from 'debug';

import * as actions from '../actions';

const log = debug('kammy:reducers/my-team');

export default function myTeam(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_TEAM}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.getTeam,
      };
    case `${actions.UPDATE_TEAM}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.updateTeam,
      };
    default:
      return state;
  }
}
