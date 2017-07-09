import debug from 'debug';

import * as actions from '../actions';

const log = debug('kammy:reducers/players');

function clean(obj) { // remove null's
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (!val) return;
    newObj[key] = val;
  });

  return newObj;
}

const updatePlayersData = (state, action) => {
  const allPlayers = [...state.data];
  const updates = action.payload.data && action.payload.data.updatePlayers;
  updates.forEach((update) => {
    const cleanUpdate = clean(update);
    allPlayers.find((player, i) => { // eslint-disable-line array-callback-return
      if (player._id === update._id) {
        allPlayers[i] = { ...player, ...cleanUpdate };
      }
    });
  });
  return allPlayers;
};

export default function players(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_PLAYERS}_FULFILLED`:
      return {
        ...state,
        data: data && data.getPlayers,
      };
    case `${actions.IMPORT_PLAYERS}_FULFILLED`:
      return {
        ...state,
        data: data && data.importPlayers
      };
    case `${actions.UPDATE_PLAYERS}_FULFILLED`:
      return {
        ...state,
        data: updatePlayersData(state, action)
      };
    default:
      return state;
  }
}
