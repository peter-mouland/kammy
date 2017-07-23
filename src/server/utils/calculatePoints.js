export function forStarting(starts) { // starting a match 3 point
  return starts * 3;
}

export function forSub(subs) { // sub = 1 point
  return subs * 1;
}

export function forGoals(goals, position) { // depends on position
  let multiplier = 0;
  if (position === 'GK') {
    multiplier = 10;
  } else if (position === 'FB' || position === 'CB') {
    multiplier = 8;
  } else if (position === 'WM' || position === 'CM' || position === 'M') {
    multiplier = 6;
  } else if (position === 'AM') {
    multiplier = 5;
  } else if (position === 'STR') {
    multiplier = 4;
  }
  return goals * multiplier;
}

export function forAssists(assists) { // assist = 3 points
  return assists * 3;
}

export function forYellowCards(yc) { // -2
  return parseInt(yc * -2, 10);
}

export function forRedCards(rc) { // -5
  return parseInt(rc * -5, 10);
}

export function forCleanSheet(cs, position) { // 5
  let multiplier;
  if ((position === 'FB' || position === 'CB') || position === 'GK') {
    multiplier = 5;
  } else {
    multiplier = 0;
  }
  return cs * multiplier;
}

export function forConceded(ga, position) { // -1
  let multiplier;
  if ((position === 'FB' || position === 'CB') || position === 'GK') {
    multiplier = -1;
  } else {
    multiplier = 0;
  }
  return parseInt(ga * multiplier, 10);
}

export function forPenaltiesSaved(ps) {
  return ps * 5;
}
function forMOM() {
  return 0;
}

export function calculateTotalPoints(stats, pos) {
  const apps = forStarting(stats.apps, pos);
  const subs = forSub(stats.subs, pos);
  const mom = forMOM(stats.mom, pos);
  const gls = forGoals(stats.gls, pos);
  const asts = forAssists(stats.asts, pos);
  const cs = forCleanSheet(stats.cs, pos);
  const con = forConceded(stats.con, pos);
  const pensv = forPenaltiesSaved(stats.pensv, pos);
  const ycard = forYellowCards(stats.ycard, pos);
  const rcard = forRedCards(stats.rcard, pos);
  const total = mom + gls + ycard + rcard + apps + subs + asts + cs + con + pensv;
  return { apps, subs, gls, asts, mom, cs, con, pensv, ycard, rcard, total };
}

export function calculateGameWeek(totalStats, gameWeekStats, pos, previousStats) {
  // retrieved season stats now include previous gameWeek
  const stats = {
    apps: (totalStats.apps - previousStats.apps) + gameWeekStats.apps,
    subs: (totalStats.subs - previousStats.subs) + gameWeekStats.subs,
    mom: (totalStats.mom - previousStats.mom) + gameWeekStats.mom,
    gls: (totalStats.gls - previousStats.gls) + gameWeekStats.gls,
    asts: (totalStats.asts - previousStats.asts) + gameWeekStats.asts,
    cs: (totalStats.cs - previousStats.cs) + gameWeekStats.cs,
    con: (totalStats.con - previousStats.con) + gameWeekStats.con,
    pensv: (totalStats.pensv - previousStats.pensv) + gameWeekStats.pensv,
    ycard: (totalStats.ycard - previousStats.ycard) + gameWeekStats.ycard,
    rcard: (totalStats.rcard - previousStats.rcard) + gameWeekStats.rcard
  };
  const points = calculateTotalPoints(stats, pos);
  return {
    points,
    stats
  };
}

export const calculatePoints = (externalPlayer, internalPlayer) => ({
  ...externalPlayer,
  ...internalPlayer,
  gameWeek: calculateGameWeek(
    externalPlayer.season.stats,
    internalPlayer.gameWeek.stats,
    internalPlayer.pos,
    internalPlayer.season.stats
  ),
  season: internalPlayer.season
});
