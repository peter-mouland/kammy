import debug from 'debug';

import * as actions from './division.actions';

const log = debug('kammy:reducers/teams');

const updateUsers = (state, updatedTeam) => {
  const updatedUsers = [...state.data];
  const updatedUserIndex = updatedUsers.findIndex((user) => user._id === updatedTeam.user._id);
  const user = state.data[updatedUserIndex];
  const updatedTeamIndex = user.teams.findIndex((team) => team._id === updatedTeam._id);
  user.teams[updatedTeamIndex] = updatedTeam;
  updatedUsers[updatedUserIndex] = user;
  return updatedUsers;
};

export default function divisions(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.ASSIGN_TEAM_TO_DIVISION}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: updateUsers(data && data.assignTeamToDivision),
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
