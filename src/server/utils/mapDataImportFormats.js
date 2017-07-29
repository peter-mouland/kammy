const mapper = () => ({
  STARTING_XI: 0,
  NA: 1,
  SUBS: 2,
  GOALS: 3,
  ASSISTS: 4,
  YELLOW_CARDS: 5,
  RED_CARDS: 6,
  CLEAN_SHEETS: 7,
  CONCEDED: 8,
  OWN_GOALS: 9,
  SAVED_PENALTIES: 10,
  MISSED_PENALTIES: 11,
  MAN_OF_MATCH: 12,
  PASSING_BONUS1: 13,
  TACKLE_BONUS1: 14,
  SAVE_BONUS1: 15,
  SHOTS_BONUS1: 16,
  PASSING_BONUS2: 17,
  TACKLE_BONUS2: 18,
  SAVE_BONUS2: 19,
  SHOTS_BONUS2: 20,
  TOTAL_PASSES: 21,
  TOTAL_TACKLES: 22,
  TOTAL_SAVES: 23,
  TOTAL_SHOTS: 24,
  SKY_FF_POINTS: 25,
});

export const zeros = {
  total: 0,
  apps: 0,
  mom: 0,
  subs: 0,
  gls: 0,
  tb: 0,
  sb: 0,
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
      player.apps, // 0
      null, // 1
      player.subs, // 2
      player.gls, // 3
      player.asts, // 4
      player.ycard, // 5
      player.rcard, // 6
      player.cs, // 7
      player.con, // 8
      null, // 9
      player.pensv, // 10
      null, // 11
      player.mom, // 12
      null, // 13
      player.tb || 0, // 14
      player.sb || 0, // 15
      null, // 16
      null // 17
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
  delete player.gw2;
  return player;
};

export const mapImportToSchema = (player) => {
  player.id = player.code;
  player.name = player.player;
  player.season = {
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
  const stats = {
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
    tb: parseInt(season[map.TACKLE_BONUS1], 10) + parseInt(season[map.TACKLE_BONUS2], 10),
    sb: parseInt(season[map.SAVE_BONUS1], 10) + parseInt(season[map.SAVE_BONUS2], 10),
  };
  player.code = player.id;
  player.gameWeek = {
    stats: zeros,
    points: zeros,
  };
  player.season = {
    stats,
    points: zeros
  };
  player.name = player.name || `${player.sName}, ${player.fName}`;
  player.club = player.club || player.tName;
  delete player.id;
  delete player.stats;
  delete player.sName;
  delete player.fName;
  delete player.tName;
  delete player.tCode;
  delete player.avail;
  delete player.picked;
  delete player.group; // pos
  delete player.pts;
  delete player.nxtfix;
  return player;
};

