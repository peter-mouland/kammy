const map = {
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
};

export const zeros = {
  points: 0,
  apps: 0,
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

export const mapStats = (stats) => ({
  apps: stats[map.STARTING_XI] || 0,
  subs: stats[map.SUBS] || 0,
  gls: stats[map.GOALS] || 0,
  asts: stats[map.ASSISTS] || 0,
  cs: stats[map.CLEAN_SHEETS] || 0,
  con: stats[map.CONCEDED] || 0,
  pensv: stats[map.SAVED_PENALTIES] || 0,
  ycard: stats[map.YELLOW_CARDS] || 0,
  rcard: stats[map.RED_CARDS] || 0,
  tb: parseInt(stats[map.TACKLE_BONUS1], 10) + parseInt(stats[map.TACKLE_BONUS2], 10) || 0,
  sb: parseInt(stats[map.SAVE_BONUS1], 10) + parseInt(stats[map.SAVE_BONUS2], 10) || 0,
  points: 0
});


export const mapImportToSkyFormat = (player) => {
  const formattedPlayer = {
    ...player,
    id: player.code,
    name: player.player,
    stats: {
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
      ]
    }
  };
  delete formattedPlayer.new;
  delete formattedPlayer.player_2;
  delete formattedPlayer.apps;
  delete formattedPlayer.subs;
  delete formattedPlayer.gls;
  delete formattedPlayer.asts;
  delete formattedPlayer.mom;
  delete formattedPlayer.cs;
  delete formattedPlayer.con;
  delete formattedPlayer.pensv;
  delete formattedPlayer.ycard;
  delete formattedPlayer.rcard;
  delete formattedPlayer.change;
  delete formattedPlayer.player;
  delete formattedPlayer.gw0;
  delete formattedPlayer.gw1;
  delete formattedPlayer.gw2;
  return formattedPlayer;
};

export const mapImportToSchema = (player) => {
  const formattedPlayer = {
    ...player,
    id: player.code,
    name: player.player,
    season: zeros,
    gameWeek: zeros,
  };
  delete formattedPlayer.id;
  delete formattedPlayer.new;
  delete formattedPlayer.player_2;
  delete formattedPlayer.apps;
  delete formattedPlayer.subs;
  delete formattedPlayer.gls;
  delete formattedPlayer.asts;
  delete formattedPlayer.mom;
  delete formattedPlayer.cs;
  delete formattedPlayer.con;
  delete formattedPlayer.pensv;
  delete formattedPlayer.ycard;
  delete formattedPlayer.rcard;
  delete formattedPlayer.change;
  delete formattedPlayer.player;
  delete formattedPlayer.gw0;
  delete formattedPlayer.gw1;
  return formattedPlayer;
};

export const mapSkyFormatToSchema = (player) => {
  const season = player.stats && player.stats.season;
  const formattedPlayer = {
    ...player,
    code: player.id,
    gameWeek: zeros,
    season: mapStats(season),
    name: player.name || `${player.sName}, ${player.fName}`,
    club: player.club || player.tName
  };
  delete formattedPlayer.id;
  delete formattedPlayer.stats;
  delete formattedPlayer.sName;
  delete formattedPlayer.fName;
  delete formattedPlayer.tName;
  delete formattedPlayer.tCode;
  delete formattedPlayer.avail;
  delete formattedPlayer.picked;
  delete formattedPlayer.group; // pos
  delete formattedPlayer.pts;
  delete formattedPlayer.nxtfix;
  return formattedPlayer;
};

