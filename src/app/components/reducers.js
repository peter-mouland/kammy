import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import debug from 'debug';

import seasons from './AdminPage/Seasons/seasons.reducer';
import stats from './AdminPage/Seasons/stats.reducer';
import users from './AdminPage/Users/users.reducer';
import teams from './AdminPage/teams.reducer';
import myTeam from './MyTeamPage/my-team.reducer';
import dashboard from './DashboardPage/dashboard.reducer';
import divisions from './DivisionsPage/divisions.reducer';
import players from './Players/players.reducer';

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


export default combineReducers({
  promiseState,
  seasons,
  teams,
  users,
  stats,
  myTeam,
  players,
  dashboard,
  divisions,
  routing
});
