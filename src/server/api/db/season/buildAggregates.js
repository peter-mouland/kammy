import { positionMapping } from '../../../../app/components/Positions/Positions';

const addStringFactory = (period) =>
  (pos) => positionMapping[pos].statsFields.map((col) => `$${period}.${col}`);

const add = {
  season: addStringFactory('season'),
  gameWeek: addStringFactory('gameWeek')
};

const addPoints = (period) =>
  (Object.keys(positionMapping)).reduce((prev, curr) => prev.concat(add[period](curr)), []);

const buildAggFields = (pos, period) => {
  const $add = (pos === 'points')
    ? addPoints('gameWeek')
    : add.gameWeek(pos);
  if (period === 'season') {
    const $addSeason = (pos === 'points')
      ? addPoints('season')
      : add.season(pos);
    return $add.concat($addSeason);
  }
  return $add;
};

const buildAggFieldsFactory = (period) => {
  const points = { [`${period}.points`]: { $add: buildAggFields('points', period) } };
  return (Object.keys(positionMapping)).reduce((prev, curr) => {
    const fields = { [`${period}.${curr}`]: { $add: buildAggFields(curr, period) } };
    return ({ ...prev, ...fields });
  }, { ...points });
};
const seasonFields = buildAggFieldsFactory('season');
const gameWeekFields = buildAggFieldsFactory('gameWeek');

export default { ...seasonFields, ...gameWeekFields };

// const aggFields = {
//   'season.gks': { $add: buildAggFields('gks', true) },
//   'season.cb': { $add: ['$season.cbleft', '$season.cbright'] },
//   'season.fb': { $add: ['$season.fbleft', '$season.fbright'] },
//   'season.cm': { $add: ['$season.cmleft', '$season.cmright'] },
//   'season.wm': { $add: ['$season.wmleft', '$season.wmright'] },
//   'season.str': { $add: ['$season.strleft', '$season.strright'] },
//   'season.points': { $add:
// ['$season.gk', '$season.sub', '$season.cbleft', '$season.cbright', '$season.fbleft',
// '$season.fbright', '$season.cmleft', '$season.cmright', '$season.wmleft',
// '$season.wmright', '$season.strleft', '$season.strright'] },
//   'gameWeek.gks': { $add: ['$gameWeek.gk', '$gameWeek.sub'] },
//   'gameWeek.cb': { $add: ['$gameWeek.cbleft', '$gameWeek.cbright'] },
//   'gameWeek.fb': { $add: ['$gameWeek.fbleft', '$gameWeek.fbright'] },
//   'gameWeek.cm': { $add: ['$gameWeek.cmleft', '$gameWeek.cmright'] },
//   'gameWeek.wm': { $add: ['$gameWeek.wmleft', '$gameWeek.wmright'] },
//   'gameWeek.str': { $add: ['$gameWeek.strleft', '$gameWeek.strright'] },
//   'gameWeek.points': { $add: ['$gameWeek.gk', '$gameWeek.sub', '$gameWeek.cbleft',
// '$gameWeek.cbright', '$gameWeek.fbleft', '$gameWeek.fbright', '$gameWeek.cmleft',
// '$gameWeek.cmright', '$gameWeek.wmleft', '$gameWeek.wmright', '$gameWeek.strleft',
// '$gameWeek.strright'] },
// };
// aggFields.season = 1; // show season in agg query response.
