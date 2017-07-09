import debug from 'debug';

import { fetch } from '../../utils';

export const FETCH_DASHBOARD_DATA = 'FETCH_DASHBOARD_DATA';

const log = debug('kammy:dashboard.actions');

export function fetchDashboardData() {
  return {
    type: FETCH_DASHBOARD_DATA,
    payload: fetch.graphQL('getDashboardQuery')
  };
}
