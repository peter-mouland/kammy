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
  } else if (position === 'WM' || position === 'CM') {
    multiplier = 6;
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

function forPenaltiesSaved(ps) {
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
  return {
    apps,
    subs,
    gls,
    asts,
    mom,
    cs,
    con,
    pensv,
    ycard,
    rcard,
    total
  };
}

export function calculateGameWeek(totalStats, pos, previousStats) {
  const points = {
    apps: forStarting(totalStats.apps, pos) - forStarting(previousStats.apps, pos),
    subs: forSub(totalStats.subs, pos) - forSub(previousStats.subs, pos),
    mom: forMOM(totalStats.mom, pos) - forMOM(previousStats.mom, pos),
    gls: forGoals(totalStats.gls, pos) - forGoals(previousStats.gls, pos),
    asts: forAssists(totalStats.asts, pos) - forAssists(previousStats.asts, pos),
    cs: forCleanSheet(totalStats.cs, pos) - forCleanSheet(previousStats.cs, pos),
    con: forConceded(totalStats.con, pos) - forConceded(previousStats.con, pos),
    pensv: forPenaltiesSaved(totalStats.pensv, pos) - forPenaltiesSaved(previousStats.pensv, pos),
    ycard: forYellowCards(totalStats.ycard, pos) - forYellowCards(previousStats.ycard, pos),
    rcard: forRedCards(totalStats.rcard, pos) - forRedCards(previousStats.rcard, pos),
  };
  return {
    points: {
      ...points,
      total: points.apps + points.subs + points.mom + points.gls + points.asts + points.cs
              + points.con + points.ycard + points.rcard + points.pensv
    },
    stats: {
      apps: totalStats.apps - previousStats.apps,
      subs: totalStats.subs - previousStats.subs,
      mom: totalStats.mom - previousStats.mom,
      gls: totalStats.gls - previousStats.gls,
      asts: totalStats.asts - previousStats.asts,
      cs: totalStats.cs - previousStats.cs,
      con: totalStats.con - previousStats.con,
      pensv: totalStats.pensv - previousStats.pensv,
      ycard: totalStats.ycard - previousStats.ycard,
      rcard: totalStats.rcard - previousStats.rcard
    }
  };
}

// side-effecty :S
export const calculatePoints = (player, previousStats) => {
  player.total.points = calculateTotalPoints(player.total.stats, player.pos);
  player.gameWeek = previousStats
    ? calculateGameWeek(player.total.stats, player.pos, previousStats)
    : player.total.stats;
  return player;
};
