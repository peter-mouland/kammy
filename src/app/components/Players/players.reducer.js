import debug from 'debug';

import * as actions from './players.actions';

const log = debug('kammy:reducers/players');

function removeNulls(obj) { // remove null's
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val === null || val === undefined) return;
    newObj[key] = val;
  });

  return newObj;
}

const updatePlayersData = (state, action) => {
  const allPlayers = [...state.data];
  const updates = action.payload.data && action.payload.data.updatePlayers;
  updates.forEach((update) => {
    const cleanUpdate = removeNulls(update);
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
    case `${actions.FETCH_PLAYERS}_PENDING`:
      return {
        ...state,
        loading: true,
      };
    case `${actions.FETCH_PLAYERS}_FULFILLED`:
      return {
        ...state,
        data: data && data.getPlayers,
        errors: action.payload.errors,
        loading: false,
      };
    case `${actions.FETCH_PLAYERS}_REJECTED`:
      return {
        ...state,
        errors: [action.payload],
        loading: false,
      };
    case `${actions.IMPORT_PLAYERS}_PENDING`:
      return {
        ...state,
        importing: true
      };
    case `${actions.IMPORT_PLAYERS}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        importing: false
      };
    case `${actions.IMPORT_PLAYERS}_REJECTED`:
      return {
        ...state,
        errors: [action.payload],
        importing: false,
      };
    case `${actions.UPDATE_PLAYERS}_PENDING`:
      return {
        ...state,
        updating: true
      };
    case `${actions.UPDATE_PLAYERS}_FULFILLED`:
      return {
        ...state,
        data: !action.payload.errors ? updatePlayersData(state, action) : [],
        errors: action.payload.errors,
        updating: false
      };
    case `${actions.UPDATE_PLAYERS}_REJECTED`:
      return {
        ...state,
        errors: [action.payload],
        updating: false,
      };
    default:
      return state;
  }
}
