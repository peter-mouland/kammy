import debug from 'debug';

const log = debug('kammy:analyze-fixtures');

const base = {
  apps: {
    total: 0, avg: 0, max: 0, min: 0
  },
  subs: {
    total: 0, avg: 0, max: 0, min: 0
  },
  gls: {
    total: 0, avg: 0, max: 0, min: 0
  },
  tb: {
    total: 0, avg: 0, max: 0, min: 0
  },
  sb: {
    total: 0, avg: 0, max: 0, min: 0
  },
  asts: {
    total: 0, avg: 0, max: 0, min: 0
  },
  ycard: {
    total: 0, avg: 0, max: 0, min: 0
  },
  rcard: {
    total: 0, avg: 0, max: 0, min: 0
  },
  cs: {
    total: 0, avg: 0, max: 0, min: 0
  },
  con: {
    total: 0, avg: 0, max: 0, min: 0
  },
  pensv: {
    total: 0, avg: 0, max: 0, min: 0
  },
};

function average(prev, curr, i, arr) { return prev + (curr / arr.length); }
function sum(prev, curr) { return prev + curr; }
function extractStats(prev, curr) {
  const next = { ...prev };
  Object.keys(curr.stats).forEach((key) => {
    if (!prev[key]) next[key] = [];
    next[key].push(curr.stats[key]);
  });
  return next;
}

export default function analyzeFixtures(fixtures = []) {
  const playedFixtures = fixtures.filter((fixture) => fixture.status === 'PLAYED');
  const stats = playedFixtures.reduce(extractStats, {});
  return (Object.keys(stats)).reduce((prev, curr) => {
    prev[curr] = { // eslint-disable-line no-param-reassign
      total: stats[curr].reduce(sum, 0),
      avg: stats[curr].reduce(average, 0),
      max: Math.max.apply(null, stats[curr]),
      min: Math.min.apply(null, stats[curr]),
    };
    return prev;
  }, base);
}
