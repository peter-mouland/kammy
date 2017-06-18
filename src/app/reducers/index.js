import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import debug from 'debug';

import * as actions from '../actions';

const log = debug('kammy:reducers/index');

const addLeagueToState = (state, seasonId, newLeague) => {
  const newState = {
    ...state
  };
  const season = newState.data.find((ssn) => ssn._id === seasonId);
  season.leagues.push(newLeague);
  return newState;
};

function clean(obj) { // remove null's
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (!val) return;
    newObj[key] = val;
  });

  return newObj;
}

function updatedSeasonState(state, updatedSeason) {
  const idx = state.findIndex((season) => season._id === updatedSeason._id);
  const newData = [...state];
  newData[idx] = updatedSeason;
  return newData;
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

const updateUsers = (state, updatedTeam) => {
  const updatedUsers = [...state.data];
  const updatedUserIndex = updatedUsers.findIndex((user) => user._id === updatedTeam.user._id);
  const user = state.data[updatedUserIndex];
  const updatedTeamIndex = user.teams.findIndex((team) => team._id === updatedTeam._id);
  user.teams[updatedTeamIndex] = updatedTeam;
  updatedUsers[updatedUserIndex] = user;
  return updatedUsers;
};

export function promiseState(state = {}, action) {
  const splitAction = action.type.split('_');
  const postFix = splitAction.pop();
  const actionType = splitAction.join('_');
  switch (postFix) {
    case 'PENDING':
      return {
        ...state,
        loading: actionType
      };
    case 'FULFILLED':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors,
        status: action.status
      };
    case 'REJECTED':
      return {
        ...state,
        loading: false,
        errors: [action.payload],
        status: action.status
      };
    default:
      return state;
  }
}

export function players(state = {}, action) {
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

export function stats(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_STATS}_PENDING`:
      return {
        ...state,
        loading: true,
        errors: [],
      };
    case `${actions.FETCH_STATS}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data.getStats && data.getStats.stats,
      };
    default:
      return state;
  }
}

export function seasons(state = {}, action) {
  const data = action.payload && action.payload.data;
  const newSeason = data && data.addSeason;
  const updatedSeason = data && data.updateSeason;
  const newLeague = data && data.addLeague;
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
    case `${actions.ADD_LEAGUE}_FULFILLED`:
      return addLeagueToState(state, action.meta.seasonId, newLeague);
    default:
      return state;
  }
}

export function teams(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_TEAMS}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.getTeams,
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

export function users(state = {}, action) {
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
    case `${actions.ASSIGN_TEAM_TO_LEAGUE}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: updateUsers(data && data.assignTeamToLeague),
      };
    default:
      return state;
  }
}

export function myTeam(state = {}, action) {
  const data = action.payload && action.payload.data;
  switch (action.type) {
    case `${actions.FETCH_TEAM}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.getTeam,
      };
    case `${actions.UPDATE_TEAM}_FULFILLED`:
      return {
        ...state,
        errors: action.payload.errors,
        data: data && data.updateTeam,
      };
    default:
      return state;
  }
}

export function dashboard(state = {}, action) {
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

export default combineReducers({
  promiseState,
  seasons,
  teams,
  users,
  stats,
  myTeam,
  players,
  dashboard,
  routing
});
