import debug from 'debug';

import * as actions from '../actions';

const log = debug('kammy:reducers/teams');

export default function teams(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_TEAMS}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.getTeams,
      };
    case `${actions.UPDATE_TEAM}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.updatedTeam,
      };
    default:
      return state;
  }
}
