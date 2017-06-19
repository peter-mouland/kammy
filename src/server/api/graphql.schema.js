import { makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';

const schemaString = `
  scalar JSON

  type MinDetail {
    _id: String
    name: String
  }
  type MinPlayerDetail {
    _id: String
    name: String
    club: String
  }
  type Team {
    _id: String
    name: String
    user: MinDetail
    season: MinDetail
    league: MinDetail
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
  }
  type League {
    _id: String
    name: String
    tier: Int
  }
  type Season {
    _id: String!
    name: String
    isLive: Boolean
    currentGW: Int
    leagues: [League]
  }
  type Player {
    _id: String!
    code: Int
    name: String
    pos: String
    club: String
  }
  type UpdatedPlayer { 
    _id: String!
    code: Int
    name: String
    pos: String
    club: String
  }
  type Stats {
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
    total: Int
  }

  type GameWeek {
    stats: Stats
    points: Points
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
    league: InputMinDetail
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
    club: String
    name: String
    pos: String
  }
  
  type Query {
    getTeam(teamId: String): Team
    getTeams: [Team]
    getStats(currentGW: Int, source: String): Stats
    getSeasons: [Season]
    getPlayers(player: String): [Player]
    getUser(email: String, _id: String): User
    getUsersWithTeams: [UserTeams]
    getDashboard: Dashboard
  }
  
  type Mutation {
    importPlayers: [UpdatedPlayer]
    updatePlayers(playerUpdates: [PlayerUpdates]): [UpdatedPlayer]
    addUser(seasonId: String, leagueId: String, email: String, name: String): UserTeams
    addLeague(seasonId: String, name: String): League
    addSeason(name: String): Season
    updateTeam(teamUpdate: TeamUpdate): Team
    assignTeamToLeague(leagueId: String, leagueName: String, teamId: String): Team
    updateSeason(seasonId: String, isLive: Boolean, currentGW: Int): Season
    updateStats(seasonId: String, update: JSON): Stats
  }
`;

const resolveFunctions = {
  JSON: GraphQLJSON
};

const jsSchema = makeExecutableSchema({ typeDefs: schemaString, resolvers: resolveFunctions });

export default jsSchema;

