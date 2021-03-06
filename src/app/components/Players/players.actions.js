import debug from 'debug';

import { fetch } from '../../utils/index';

export const FETCH_PLAYERS = 'FETCH_PLAYERS';
export const FETCH_PLAYER_FIXTURES = 'FETCH_PLAYER_FIXTURES';
export const IMPORT_PLAYERS = 'IMPORT_PLAYERS';
export const UPDATE_PLAYERS = 'UPDATE_PLAYERS';

const log = debug('kammy:players.actions');

export function fetchPlayers(player) {
  return {
    type: FETCH_PLAYERS,
    payload: fetch.graphQL('getPlayersQuery', player ? { player } : undefined)
  };
}

export function fetchPlayerFixtures({ code }) {
  return {
    type: FETCH_PLAYER_FIXTURES,
    payload: fetch.graphQL('getPlayerFixturesQuery', { code })
  };
}

export function importPlayers() {
  return {
    type: IMPORT_PLAYERS,
    payload: fetch.graphQL('importPlayersMutation')
  };
}

export function updatePlayers(playerUpdates) {
  return {
    type: UPDATE_PLAYERS,
    payload: fetch.graphQL('updatePlayersMutation', playerUpdates)
  };
}
