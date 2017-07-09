import debug from 'debug';

import * as actions from './admin-page.actions';

const log = debug('kammy:reducers/users');

const updateUsers = (state, updatedTeam) => {
  const updatedUsers = [...state.data];
  const updatedUserIndex = updatedUsers.findIndex((user) => user._id === updatedTeam.user._id);
  const user = state.data[updatedUserIndex];
  const updatedTeamIndex = user.teams.findIndex((team) => team._id === updatedTeam._id);
  user.teams[updatedTeamIndex] = updatedTeam;
  updatedUsers[updatedUserIndex] = user;
  return updatedUsers;
};

export default function users(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_USERS_WITH_TEAMS}_PENDING`:
    case `${actions.ADD_USER}_PENDING`:
      return {
        ...state,
        loading: true,
        errors: [],
      };
    case `${actions.FETCH_USERS_WITH_TEAMS}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.getUsersWithTeams,
      };
    case `${actions.ADD_USER}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: [
          ...state.data,
          data && data.addUser
        ],
      };
    case `${actions.ASSIGN_TEAM_TO_DIVISION}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: updateUsers(data && data.assignTeamToDivision),
      };
    default:
      return state;
  }
}
