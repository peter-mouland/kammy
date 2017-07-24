import debug from 'debug';

import * as actions from './users.actions';

const log = debug('kammy:reducers/users');

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
    case `${actions.UPDATE_USER}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.updateUser,
      };
    default:
      return state;
  }
}
