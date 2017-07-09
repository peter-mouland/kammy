import debug from 'debug';

import { fetch } from '../../utils';

export const FETCH_DIVISIONS = 'FETCH_DIVISIONS';

const log = debug('kammy:actions');

export function fetchDivisions() {
  return {
    type: FETCH_DIVISIONS,
    payload: fetch.graphQL('getDivisionsQuery', {})
  };
}
