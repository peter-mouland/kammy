import { makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';

const schemaString = `
  scalar JSON

  type PlayerStats {
    total: Int
    apps: Int
    subs: Int
    gls: Int
    asts: Int
    mom: Int
    cs: Int
    con: Int
    pensv: Int
    ycard: Int
    rcard: Int
  }

  type Points {
    gk: Int
    cbleft: Int
    cbright: Int
    fbleft: Int
    fbright: Int
    cmleft: Int
    cmright: Int
    wmleft: Int
    wmright: Int
    strleft: Int
    strright: Int
    cb: Int 
    fb: Int 
    cm: Int 
    wm: Int 
    str: Int
    sub: Int
    points: Int
  }
  
  type GameWeek {
    stats: PlayerStats
    points: PlayerStats
  }

  type MinDetail {
    _id: String
    name: String
  }
  type MinPlayerDetail {
    _id: String
    name: String
    club: String
    code: Int
  }
  type Team {
    _id: String
    name: String
    user: MinDetail
    season: MinDetail
    division: MinDetail
    gk: MinPlayerDetail
    cbleft: MinPlayerDetail
    cbright: MinPlayerDetail
    fbleft: MinPlayerDetail
    fbright: MinPlayerDetail
    cmleft: MinPlayerDetail
    cmright: MinPlayerDetail
    wmleft: MinPlayerDetail
    wmright: MinPlayerDetail
    strleft: MinPlayerDetail
    strright: MinPlayerDetail
    sub: MinPlayerDetail
    gameWeek: Points
    total: Points
    gameWeekRank: Points
    seasonRank: Points
  }
  type Division {
    _id: String
    name: String
    tier: Int
  }
  type Season {
    _id: String!
    name: String
    isLive: Boolean
    currentGW: Int
    divisions: [Division]
  }
  type UpdatedPlayer { 
    _id: String!
    code: Int
    name: String
    pos: String
    club: String
  }

  type Player {
    _id: String!
    name: String!
    code: Int
    pos: String
    club: String
    new: String
    gameWeek: GameWeek
    total: GameWeek
    pointsChange: Int
  }

  type User {
    _id: String!
    email: String!
    name: String
    mustChangePassword: Boolean
  }
  
  type Dashboard {
    message: String!
  }

  type UserTeams {
    _id: String!
    email: String!
    name: String
    teams: [Team]
  }
  
  type Divisions {
    _id: String!
    tier: Int
    name: String
    teams: [Team]
  }

  # Object of players and their stats.
  # ie.
  # {
  #   [playerName]: { ...PlayerStats }
  # }
  type Stats {
    stats: JSON 
  }
  
  input InputStats {
    stats: JSON
  }
  
  input InputMinDetail {
    _id: String
    name: String
  }
  input InputMinPlayerDetail {
    _id: String
    name: String
    club: String
    code: Int
    pos: String
  }

  input TeamUpdate {
    _id: String
    name: String
    user: InputMinDetail
    season: InputMinDetail
    division: InputMinDetail
    gk: InputMinPlayerDetail
    cbleft: InputMinPlayerDetail
    cbright: InputMinPlayerDetail
    fbleft: InputMinPlayerDetail
    fbright: InputMinPlayerDetail
    cmleft: InputMinPlayerDetail
    cmright: InputMinPlayerDetail
    wmleft: InputMinPlayerDetail
    wmright: InputMinPlayerDetail
    strleft: InputMinPlayerDetail
    strright: InputMinPlayerDetail
    sub: InputMinPlayerDetail
  }

  input PlayerUpdates {
    _id: String
    code: Int
    club: String
    name: String
    pos: String
  }
  
  type Query {
    getTeam(teamId: String): Team
    getTeams: [Team]
    getExternalStats(currentGW: Int, source: String): Stats
    getSeasons: [Season]
    getDivisions: [Divisions]
    getPlayers(player: String): [Player]
    getUser(email: String, _id: String): User
    getUsersWithTeams: [UserTeams]
    getDashboard: Dashboard
  }
  
  type Mutation {
    importPlayers: [UpdatedPlayer]
    updatePlayers(playerUpdates: [PlayerUpdates]): [UpdatedPlayer]
    addUser(seasonId: String, divisionId: String, email: String, name: String): UserTeams
    addDivision(seasonId: String, name: String): Division
    addSeason(name: String): Season
    updateTeam(teamUpdate: TeamUpdate): Team
    assignTeamToDivision(divisionId: String, divisionName: String, teamId: String): Team
    updateSeason(seasonId: String, isLive: Boolean, currentGW: Int): Season
    saveGameWeekStats(seasonId: String, update: JSON): Stats
  }
`;

const resolveFunctions = {
  JSON: GraphQLJSON
};

const jsSchema = makeExecutableSchema({ typeDefs: schemaString, resolvers: resolveFunctions });

export default jsSchema;

