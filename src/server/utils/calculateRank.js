
const sortingFactory = (pos, data) => (itemA, itemB) => itemA[data][pos] - itemB[data][pos];

function rank(arr, pos, data) {
  const sorter = sortingFactory(pos, data);
  const sorted = arr.slice().sort(sorter);
  const ranked = arr.map((item) => sorted.findIndex((i) => sorter(item, i) === 0));
  const adjustRankForTies = (item, i) => (
    ranked.findIndex((rItem, rI) => rItem === item && i !== rI) > -1 ? item + 0.5 : item
  );
  return ranked.map(adjustRankForTies);
}

export default (teams) => {
  const gwSUB = rank(teams, 'sub', 'gameWeek');
  const gwCB = rank(teams, 'cb', 'gameWeek');
  const gwFB = rank(teams, 'fb', 'gameWeek');
  const gwWM = rank(teams, 'wm', 'gameWeek');
  const gwCM = rank(teams, 'cm', 'gameWeek');
  const gwSTR = rank(teams, 'str', 'gameWeek');
  const gwGK = rank(teams, 'gk', 'gameWeek');
  const sSUB = rank(teams, 'sub', 'total');
  const sCB = rank(teams, 'cb', 'total');
  const sFB = rank(teams, 'fb', 'total');
  const sWM = rank(teams, 'wm', 'total');
  const sCM = rank(teams, 'cm', 'total');
  const sSTR = rank(teams, 'str', 'total');
  const sGK = rank(teams, 'gk', 'total');

  return teams.map((team, i) => {
    const seasonRank = {
      sub: sSUB[i],
      cb: sCB[i],
      fb: sFB[i],
      wm: sWM[i],
      cm: sCM[i],
      str: sSTR[i],
      gk: sGK[i],
      points: sSUB[i] + sCB[i] + sFB[i] + sWM[i] + sCM[i] + sSTR[i] + sGK[i]
    };

    const gameWeekRankChange = {
      sub: (gwSUB[i] - sSUB[i]),
      cb: (gwCB[i] - sCB[i]),
      fb: (gwFB[i] - sFB[i]),
      wm: (gwWM[i] - sWM[i]),
      cm: (gwCM[i] - sCM[i]),
      str: (gwSTR[i] - sSTR[i]),
      gk: (gwGK[i] - sGK[i]),
    };
    return {
      ...team,
      gameWeekRankChange: {
        ...gameWeekRankChange,
        points:
        gameWeekRankChange.cb + gameWeekRankChange.fb +
        gameWeekRankChange.wm + gameWeekRankChange.cm +
        gameWeekRankChange.str + gameWeekRankChange.gk
      },
      seasonRank
    };
  });
};
