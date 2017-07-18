
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
  const gwGKS = rank(teams, 'gks', 'gameWeek');
  const gwCB = rank(teams, 'cb', 'gameWeek');
  const gwFB = rank(teams, 'fb', 'gameWeek');
  const gwWM = rank(teams, 'wm', 'gameWeek');
  const gwCM = rank(teams, 'cm', 'gameWeek');
  const gwSTR = rank(teams, 'str', 'gameWeek');
  const sGKS = rank(teams, 'gks', 'total');
  const sCB = rank(teams, 'cb', 'total');
  const sFB = rank(teams, 'fb', 'total');
  const sWM = rank(teams, 'wm', 'total');
  const sCM = rank(teams, 'cm', 'total');
  const sSTR = rank(teams, 'str', 'total');

  const gwPointsTotal = teams.reduce((sum, team) => sum + team.gameWeek.points, 0);

  return teams.map((team, i) => {
    const seasonRank = {
      gks: sGKS[i],
      cb: sCB[i],
      fb: sFB[i],
      wm: sWM[i],
      cm: sCM[i],
      str: sSTR[i],
      points: sGKS[i] + sCB[i] + sFB[i] + sWM[i] + sCM[i] + sSTR[i]
    };

    const gameWeekRankChange = {
      gks: !gwPointsTotal ? 0 : (gwGKS[i] - sGKS[i]),
      cb: !gwPointsTotal ? 0 : (gwCB[i] - sCB[i]),
      fb: !gwPointsTotal ? 0 : (gwFB[i] - sFB[i]),
      wm: !gwPointsTotal ? 0 : (gwWM[i] - sWM[i]),
      cm: !gwPointsTotal ? 0 : (gwCM[i] - sCM[i]),
      str: !gwPointsTotal ? 0 : (gwSTR[i] - sSTR[i]),
    };

    return {
      ...team,
      gameWeekRankChange: {
        ...gameWeekRankChange,
        points:
        gameWeekRankChange.cb + gameWeekRankChange.fb +
        gameWeekRankChange.wm + gameWeekRankChange.cm +
        gameWeekRankChange.str + gameWeekRankChange.gks
      },
      seasonRank
    };
  });
};
