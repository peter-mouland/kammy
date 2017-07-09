import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import debug from 'debug';

import * as actions from '../actions';
import seasons from './seasons.reducer';
import stats from './stats.reducer';
import users from './users.reducer';
import teams from './teams.reducer';
import myTeam from './myTeam.reducer';
import players from './players.reducer';

const log = debug('kammy:reducers/index');

export function promiseState(state = {}, action) {
  const splitAction = action.type.split('_');
  const postFix = splitAction.pop();
  const actionType = splitAction.join('_');
  switch (postFix) {
    case 'PENDING':
      return {
        ...state,
        loading: actionType
      };
    case 'FULFILLED':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors,
        status: action.status
      };
    case 'REJECTED':
      return {
        ...state,
        loading: false,
        errors: [action.payload],
        status: action.status
      };
    default:
      return state;
  }
}

export function dashboard(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_DASHBOARD_DATA}_FULFILLED`:
      return {
        ...state,
        data: data && data.getDashboard.message,
      };
    default:
      return state;
  }
}

export default combineReducers({
  promiseState,
  seasons,
  teams,
  users,
  stats,
  myTeam,
  players,
  dashboard,
  routing
});
