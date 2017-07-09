import debug from 'debug';

import * as actions from './players.actions';

const log = debug('kammy:reducers/players');

export default function players(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_PLAYERS}_FULFILLED`:
      return {
        ...state,
        data: data && data.getPlayers,
      };
    default:
      return state;
  }
}
