// const playerStatsFragment = `
// fragment playerStatsInfo on Player {
//  gameWeek {
//    stats {
//      apps subs gls asts mom cs con pensv ycard rcard
//    }
//    points {
//      apps subs gls asts mom cs con pensv ycard rcard total
//    }
//  }
//  total {
//    stats {
//      apps subs gls asts mom cs con pensv ycard rcard
//    }
//    points {
//      apps subs gls asts mom cs con pensv ycard rcard total
//    }
//  }
// }`;

const minPlayerFragment = `
fragment minPlayerInfo on MinPlayerDetail {
  _id name club
}`;
const playerFragment = `
fragment playerInfo on Player {
  _id code pos name club
}`;

const leagueFragment = `
fragment leagueInfo on League {
  _id name tier
}`;

const teamFragment = `
${minPlayerFragment}
fragment teamInfo on Team {
  _id user { _id name } season { _id name } league { _id name } name 
  gk { ...minPlayerInfo } 
  cbleft { ...minPlayerInfo } cbright { ...minPlayerInfo }
  fbleft { ...minPlayerInfo } fbright { ...minPlayerInfo } 
  cmleft { ...minPlayerInfo } cmright { ...minPlayerInfo } 
  wmleft { ...minPlayerInfo } wmright { ...minPlayerInfo } 
  strleft { ...minPlayerInfo } strright { ...minPlayerInfo } 
  sub { ...minPlayerInfo }
}`;

const seasonFragment = `
${leagueFragment}
fragment seasonInfo on Season {
  _id name currentGW isLive leagues { ...leagueInfo }
}
`;

export const getPlayersQuery = `
${playerFragment}
query ($player: String) { 
  getPlayers(player: $player){ 
    ...playerInfo
 }
} 
`;

export const getDashboardQuery = `
  query { getDashboard{ message } } 
`;

export const getSeasonsQuery = `
  ${seasonFragment}
  query { getSeasons{ ...seasonInfo } }
`;

export const getTeamQuery = `
  ${teamFragment}
  query ($teamId: String) { getTeam(teamId: $teamId){ ...teamInfo } } 
`;

export const getTeamsQuery = `
  ${teamFragment}
  query { getTeams{ ...teamInfo } } 
`;

export const addSeasonsMutation = `
  ${seasonFragment}
  mutation ($name: String) { addSeason(name: $name){ ...seasonInfo } }
`;

export const addLeaguesMutation = `
  ${leagueFragment}
  mutation ($seasonId: String, $name: String) { 
    addLeague(seasonId: $seasonId, name: $name){ ...leagueInfo } 
  }
`;

export const addUserMutation = `
  ${teamFragment}
  mutation ($seasonId: String, $leagueId: String, $name: String, $email: String) { 
    addUser(seasonId: $seasonId, leagueId: $leagueId, name: $name, email: $email){ ...teamInfo  } 
  }
`;

export const updatePlayersMutation = `
  mutation ($playerUpdates: [PlayerUpdates]) { 
    updatePlayers(playerUpdates: $playerUpdates){ _id code pos name club }   
  }
`;

export const updateTeamMutation = `
  ${teamFragment}
  mutation ($teamUpdate: TeamUpdate) { 
    updateTeam(teamUpdate: $teamUpdate){ ...teamInfo }   
  }
`;
