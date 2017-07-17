const mapper = () => ({
  STARTING_XI: 0,
  MAN_OF_MATCH: 1,
  SUBS: 2,
  GOALS: 3,
  ASSISTS: 4,
  YELLOW_CARDS: 5,
  RED_CARDS: 6,
  CLEAN_SHEETS: 7,
  CONCEDED: 8,
  SAVED_PENALTIES: 11
});

const zeros = {
  total: 0,
  apps: 0,
  mom: 0,
  subs: 0,
  gls: 0,
  asts: 0,
  ycard: 0,
  rcard: 0,
  cs: 0,
  con: 0,
  pensv: 0
};

export const mapImportToSkyFormat = (player) => {
  player.id = player.code;
  player.name = player.player;
  player.stats = {
    season: [
      player.apps,
      player.mom,
      player.subs,
      player.gls,
      player.asts,
      player.ycard,
      player.rcard,
      player.cs,
      player.con,
      null,
      null,
      player.pensv
    ] };
  delete player.new;
  delete player.player_2;
  delete player.apps;
  delete player.subs;
  delete player.gls;
  delete player.asts;
  delete player.mom;
  delete player.cs;
  delete player.con;
  delete player.pensv;
  delete player.ycard;
  delete player.rcard;
  delete player.change;
  delete player.player;
  delete player.gw0;
  delete player.gw1;
  return player;
};

export const mapImportToSchema = (player) => {
  player.id = player.code;
  player.name = player.player;
  player.total = {
    stats: zeros,
    points: zeros,
  };
  player.gameWeek = {
    stats: zeros,
    points: zeros,
  };
  delete player.id;
  delete player.new;
  delete player.player_2;
  delete player.apps;
  delete player.subs;
  delete player.gls;
  delete player.asts;
  delete player.mom;
  delete player.cs;
  delete player.con;
  delete player.pensv;
  delete player.ycard;
  delete player.rcard;
  delete player.change;
  delete player.player;
  delete player.gw0;
  delete player.gw1;
  return player;
};

export const mapSkyFormatToSchema = (player) => {
  const map = mapper();
  const season = player.stats && player.stats.season;
  player.gameWeek = {};
  player.total = {
    stats: {
      apps: season[map.STARTING_XI],
      mom: season[map.MAN_OF_MATCH],
      subs: season[map.SUBS],
      gls: season[map.GOALS],
      asts: season[map.ASSISTS],
      cs: season[map.CLEAN_SHEETS],
      con: season[map.CONCEDED],
      pensv: season[map.SAVED_PENALTIES],
      ycard: season[map.YELLOW_CARDS],
      rcard: season[map.RED_CARDS],
    }
  };
  player.name = player.name || `${player.sName}, ${player.fName}`;
  player.club = player.club || player.tName;
  delete player.stats;
  delete player.sName;
  delete player.fName;
  delete player.tName;
  return player;
};

