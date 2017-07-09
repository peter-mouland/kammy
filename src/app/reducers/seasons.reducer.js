import debug from 'debug';

import * as actions from '../actions';

const log = debug('kammy:reducers/seasons');

const addDivisionToState = (state, seasonId, newDivision) => {
  const newState = {
    ...state
  };
  const season = newState.data.find((ssn) => ssn._id === seasonId);
  season.divisions.push(newDivision);
  return newState;
};


function updatedSeasonState(state, updatedSeason) {
  const idx = state.findIndex((season) => season._id === updatedSeason._id);
  const newData = [...state];
  newData[idx] = updatedSeason;
  return newData;
}


export default function seasons(state = {}, action) {
  const data = action.payload && action.payload.data;
  const newSeason = data && data.addSeason;
  const updatedSeason = data && data.updateSeason;
  const newDivision = data && data.addDivision;
  switch (action.type) {
    case `${actions.FETCH_SEASONS}_FULFILLED`:
      return {
        ...state,
        data: action.payload.data && action.payload.data.getSeasons,
      };
    case `${actions.ADD_SEASON}_FULFILLED`:
      return {
        ...state,
        data: [
          ...state.data,
          newSeason
        ]
      };
    case `${actions.FETCH_DIVISIONS}_FULFILLED`:
      return {
        ...state,
        data: action.payload.data && action.payload.data.getDivisions,
      };
    case `${actions.UPDATE_SEASON}_FULFILLED`:
      return {
        ...state,
        data: updatedSeasonState(state.data, updatedSeason)
      };
    case `${actions.ADD_DIVISION}_FULFILLED`:
      return addDivisionToState(state, action.meta.seasonId, newDivision);
    default:
      return state;
  }
}
