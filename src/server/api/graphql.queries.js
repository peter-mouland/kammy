const playerStatsFragment = `
fragment playerStatsInfo on Player {
 gameWeek {
   stats {
     apps subs gls asts mom cs con pensv ycard rcard
   }
   points {
     apps subs gls asts mom cs con pensv ycard rcard total
   }
 }
 total {
   stats {
     apps subs gls asts mom cs con pensv ycard rcard
   }
   points {
     apps subs gls asts mom cs con pensv ycard rcard total
   }
 }
}`;

const teamPointsFragment = `
fragment teamPointsInfo on Team {
 gameWeek {
    points gks cb fb cm wm str
 }
 gameWeekRankChange {
    points gks cb fb cm wm str
 }
 total {
    points gks cb fb cm wm str
 }
 seasonRank {
    points gks cb fb cm wm str
 }
}`;

const minPlayerFragment = `
fragment minPlayerInfo on MinPlayerDetail {
  _id name club code
}`;

const playerFragment = `
fragment playerInfo on Player {
  _id code pos name club 
}`;

const divisionFragment = `
fragment divisionInfo on Division {
  _id name tier
}`;

const teamFragment = `
${minPlayerFragment}
fragment teamInfo on Team {
  _id user { _id name } season { _id name } division { _id name } name 
  gk { ...minPlayerInfo } 
  cbleft { ...minPlayerInfo } cbright { ...minPlayerInfo }
  fbleft { ...minPlayerInfo } fbright { ...minPlayerInfo } 
  cmleft { ...minPlayerInfo } cmright { ...minPlayerInfo } 
  wmleft { ...minPlayerInfo } wmright { ...minPlayerInfo } 
  strleft { ...minPlayerInfo } strright { ...minPlayerInfo } 
  sub { ...minPlayerInfo }
}`;

const seasonFragment = `
${divisionFragment}
fragment seasonInfo on Season {
  _id name currentGW isLive divisions { ...divisionInfo }
}
`;

export const getPlayersQuery = `
${playerFragment}
${playerStatsFragment}
query ($player: String) { 
  getPlayers(player: $player){ 
    ...playerInfo ...playerStatsInfo
 }
} 
`;

export const getExternalStatsQuery = `
  query ($currentGW: Int, $source: String) { getExternalStats(currentGW: $currentGW, source: $source){ stats } } 
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

export const getUsersWithTeamsQuery = `
  ${teamFragment}
  query { getUsersWithTeams{ _id name email teams { ...teamInfo } } } 
`;

export const getDivisionsQuery = `
  ${teamFragment}
  ${teamPointsFragment}
  query { getDivisions{ _id name tier teams { ...teamInfo ...teamPointsInfo } } }
`;

export const addSeasonsMutation = `
  ${seasonFragment}
  mutation ($name: String) { addSeason(name: $name){ ...seasonInfo } }
`;

export const addDivisionsMutation = `
  ${divisionFragment}
  mutation ($seasonId: String, $name: String) { 
    addDivision(seasonId: $seasonId, name: $name){ ...divisionInfo } 
  }
`;

export const addUserMutation = `
  ${teamFragment}
  mutation ($seasonId: String, $divisionId: String, $name: String, $email: String) { 
    addUser(seasonId: $seasonId, divisionId: $divisionId, name: $name, email: $email){ _id name email teams { ...teamInfo } } 
  }
`;

export const assignTeamToDivisionMutation = `
  ${teamFragment}
  mutation ($divisionId: String, $divisionName: String, $teamId: String) { 
    assignTeamToDivision(divisionId: $divisionId, divisionName: $divisionName, teamId: $teamId){ ...teamInfo } 
  }
`;

export const updatePlayersMutation = `
  mutation ($playerUpdates: [PlayerUpdates]) { 
    updatePlayers(playerUpdates: $playerUpdates){ _id code pos name club }   
  }
`;

export const importPlayersMutation = `
  mutation { importPlayers { _id code pos name club } }
`;

export const updateTeamMutation = `
  ${teamFragment}
  mutation ($teamUpdate: TeamUpdate) { 
    updateTeam(teamUpdate: $teamUpdate){ ...teamInfo }   
  }
`;

export const updateSeasonMutation = `
  ${seasonFragment}
  mutation ($seasonId: String, $isLive: Boolean, $currentGW: Int) { 
    updateSeason(seasonId: $seasonId, isLive: $isLive, currentGW: $currentGW){ ...seasonInfo }   
  }
`;

export const saveGameWeekStatsMutation = `
  mutation ($seasonId: String, $update: JSON) { 
    saveGameWeekStats(seasonId: $seasonId, update: $update){ stats }   
  }
`;

export const saveSeasonStatsMutation = `
  mutation ($seasonId: String, $currentGW: Int) { 
    saveSeasonStats(seasonId: $seasonId, currentGW: $currentGW){ stats }   
  }
`;
