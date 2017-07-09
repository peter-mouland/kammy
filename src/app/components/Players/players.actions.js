import debug from 'debug';

import { fetch } from '../../utils';

export const FETCH_PLAYERS = 'FETCH_PLAYERS';

const log = debug('kammy:players.actions');

export function fetchPlayers(player) {
  return {
    type: FETCH_PLAYERS,
    payload: fetch.graphQL('getPlayersQuery', player ? { player } : undefined)
  };
}
