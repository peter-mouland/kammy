import debug from 'debug';

import * as actions from './divisions.actions';

const log = debug('kammy:divisions.reducers');

export default function seasons(state = {}, action) {
  const data = action.payload && action.payload.data;
  const divisions = data && data.getDivisions;
  switch (action.type) {
    case `${actions.FETCH_DIVISIONS}_FULFILLED`:
      return {
        ...state,
        data: divisions,
      };
    default:
      return state;
  }
}
