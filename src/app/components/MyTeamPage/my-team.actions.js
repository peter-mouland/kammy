import debug from 'debug';

import { fetch } from '../../utils';
import Auth from '../../authentication/auth-helper';

const log = debug('kammy:my-team.actions');
export const FETCH_TEAM = 'FETCH_TEAM';
export const FETCH_PLAYERS = 'FETCH_PLAYERS';
export const UPDATE_TEAM = 'UPDATE_TEAM';

export function fetchTeam({ teamId = Auth.user().defaultTeamId } = {}) {
  return {
    type: FETCH_TEAM,
    payload: fetch.graphQL('getTeamQuery', { teamId })
  };
}

export function updateTeam(teamUpdate) {
  return {
    type: UPDATE_TEAM,
    payload: fetch.graphQL('updateTeamMutation', { teamUpdate })
  };
}

export function fetchPlayers(player) {
  return {
    type: FETCH_PLAYERS,
    payload: fetch.graphQL('getPlayersQuery', player ? { player } : undefined)
  };
}
