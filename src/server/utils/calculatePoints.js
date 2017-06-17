export const mapper = (internal) => ({
  STARTING_XI: internal ? 'apps' : 0,
  SUBS: internal ? 'subs' : 2,
  GOALS: internal ? 'gls' : 3,
  ASSISTS: internal ? 'asts' : 4,
  YELLOW_CARDS: internal ? 'ycard' : 5,
  RED_CARDS: internal ? 'rcard' : 6,
  MAN_OF_MATCH: internal ? 'mom' : 1,
  CLEAN_SHEETS: internal ? 'cs' : 7,
  CONCEDED: internal ? 'con' : 8,
  SAVED_PENALTIES: internal ? 'pensv' : 11
});

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

export function calculatePoints(stats, pos) {
  const map = mapper(true);
  const apps = forStarting(stats[map.STARTING_XI], pos);
  const subs = forSub(stats[map.SUBS], pos);
  const gls = forGoals(stats[map.GOALS], pos);
  const asts = forAssists(stats[map.ASSISTS], pos);
  const mom = forMOM(stats[map.MAN_OF_MATCH], pos);
  const cs = forCleanSheet(stats[map.CLEAN_SHEETS], pos);
  const con = forConceded(stats[map.CONCEDED], pos);
  const pensv = forPenaltiesSaved(stats[map.SAVED_PENALTIES], pos);
  const ycard = forYellowCards(stats[map.YELLOW_CARDS], pos);
  const rcard = forRedCards(stats[map.RED_CARDS], pos);
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
