import debug from 'debug';

import * as actions from './seasons.actions';
import * as divActions from '../Divisions/division.actions';

const log = debug('kammy:reducers/seasons');

const updateUsers = (state, updatedTeam) => {
  const updatedUsers = [...state.data];
  const updatedUserIndex = updatedUsers.findIndex((user) => user._id === updatedTeam.user._id);
  const user = state.data[updatedUserIndex];
  const updatedTeamIndex = user.teams.findIndex((team) => team._id === updatedTeam._id);
  user.teams[updatedTeamIndex] = updatedTeam;
  updatedUsers[updatedUserIndex] = user;
  return updatedUsers;
};

const updateUsersTeam = (state, updatedTeam) => {
  let updatedTeamIndex = -1;
  const updatedUsers = [...state.seasonUsers];
  const updatedUserIndex = updatedUsers.findIndex((user) => {
    updatedTeamIndex = user.teams.findIndex((team) => team._id === updatedTeam._id);
    return updatedTeamIndex > -1;
  });
  const user = updatedUsers[updatedUserIndex];
  user.teams[updatedTeamIndex] = updatedTeam;
  updatedUsers[updatedUserIndex] = user;
  return updatedUsers;
};


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
  const seasonUsers = data && data.getUsersWithTeams;
  const updateTeam = data && data.updateTeam;

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
    case `${actions.UPDATE_SEASON}_FULFILLED`:
      return {
        ...state,
        data: updatedSeasonState(state.data, updatedSeason)
      };
    case `${actions.ADD_DIVISION}_FULFILLED`:
      return addDivisionToState(state, action.meta.seasonId, newDivision);
    // todo: this should be 'fetch_divisionTeams'
    case `${actions.FETCH_USERS_WITH_TEAMS}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        seasonUsers,
      };

    // todo: should be in divisions.reducer
    case `${divActions.ASSIGN_TEAM_TO_DIVISION}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        seasonUsers: updateUsers(data && data.assignTeamToDivision),
      };
    case `${divActions.UPDATE_TEAM}_PENDING`:
      return {
        ...state,
        updatingUserTeam: true
      };
    case `${divActions.UPDATE_TEAM}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        updatingUserTeam: false,
        seasonUsers: updateUsersTeam(state, updateTeam),
      };
    // end to do

    default:
      return state;
  }
}
