import debug from 'debug';

import * as actions from './dashboard.actions';

const log = debug('kammy:dashboard.reducer');

export default function dashboard(state = {}, action) {
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
