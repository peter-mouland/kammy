import debug from 'debug';

import { fetch } from '../../../utils/index';

export const ASSIGN_TEAM_TO_DIVISION = 'ASSIGN_TEAM_TO_DIVISION';
export const UPDATE_TEAM = 'UPDATE_TEAM';

const log = debug('kammy:admin/season.actions');

export function assignTeamToDivision({ divisionId, divisionName, teamId }) {
  return {
    type: ASSIGN_TEAM_TO_DIVISION,
    payload: fetch.graphQL('assignTeamToDivisionMutation', { divisionId, divisionName, teamId })
  };
}

export function updateTeam(teamUpdate) {
  return {
    type: UPDATE_TEAM,
    payload: fetch.graphQL('updateTeamMutation', { teamUpdate })
  };
}
