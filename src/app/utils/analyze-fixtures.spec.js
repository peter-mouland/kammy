import {expect, sinon} from '../../../tests/config/test.helper';

import analyzeFixtures from './analyze-fixtures';

const sandbox = sinon.sandbox.create();

describe('analyze-fixtures', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should return zeros for all stats by default', () => {
    const fixtures = [];
    expect(analyzeFixtures(fixtures)).to.deep.equal({
      apps: { total: 0, avg: 0, max: 0, min: 0 },
      subs: { total: 0, avg: 0, max: 0, min: 0 },
      gls: { total: 0, avg: 0, max: 0, min: 0 },
      tb: { total: 0, avg: 0, max: 0, min: 0 },
      sb: { total: 0, avg: 0, max: 0, min: 0 },
      asts: { total: 0, avg: 0, max: 0, min: 0 },
      ycard: { total: 0, avg: 0, max: 0, min: 0 },
      rcard: { total: 0, avg: 0, max: 0, min: 0 },
      cs: { total: 0, avg: 0, max: 0, min: 0 },
      con: { total: 0, avg: 0, max: 0, min: 0 },
      pensv: { total: 0, avg: 0, max: 0, min: 0 },
    });
  });

  it('should return 1 for all stats after a single fixture where all stats were 1', () => {
    const fixtures = [{
      status: 'PLAYED',
      stats: {
        apps: 1,
        subs: 1,
        gls: 1,
        tb: 1,
        sb: 1,
        asts: 1,
        ycard: 1,
        rcard: 1,
        cs: 1,
        con: 1,
        pensv: 1
      }
    }];
    expect(analyzeFixtures(fixtures)).to.deep.equal({
      apps: { total: 1, avg: 1, max: 1, min: 1 },
      subs: { total: 1, avg: 1, max: 1, min: 1 },
      gls: { total: 1, avg: 1, max: 1, min: 1 },
      tb: { total: 1, avg: 1, max: 1, min: 1 },
      sb: { total: 1, avg: 1, max: 1, min: 1 },
      asts: { total: 1, avg: 1, max: 1, min: 1 },
      ycard: { total: 1, avg: 1, max: 1, min: 1 },
      rcard: { total: 1, avg: 1, max: 1, min: 1 },
      cs: { total: 1, avg: 1, max: 1, min: 1 },
      con: { total: 1, avg: 1, max: 1, min: 1 },
      pensv: { total: 1, avg: 1, max: 1, min: 1 },
    });
  });

  it('should return 1 for all stats after a single fixture, ignored unplayed games, where all stats were 1', () => {
    const fixtures = [{
      status: 'PLAYED',
      stats: {
        apps: 1,
        subs: 1,
        gls: 1,
        tb: 1,
        sb: 1,
        asts: 1,
        ycard: 1,
        rcard: 1,
        cs: 1,
        con: 1,
        pensv: 1
      }
    },
    {
      status: 'PENDING',
    }];
    expect(analyzeFixtures(fixtures)).to.deep.equal({
      apps: { total: 1, avg: 1, max: 1, min: 1 },
      subs: { total: 1, avg: 1, max: 1, min: 1 },
      gls: { total: 1, avg: 1, max: 1, min: 1 },
      tb: { total: 1, avg: 1, max: 1, min: 1 },
      sb: { total: 1, avg: 1, max: 1, min: 1 },
      asts: { total: 1, avg: 1, max: 1, min: 1 },
      ycard: { total: 1, avg: 1, max: 1, min: 1 },
      rcard: { total: 1, avg: 1, max: 1, min: 1 },
      cs: { total: 1, avg: 1, max: 1, min: 1 },
      con: { total: 1, avg: 1, max: 1, min: 1 },
      pensv: { total: 1, avg: 1, max: 1, min: 1 },
    });
  });

  it('should return stats with after a couple fixtures, when all stats are 1 ', () => {
    const fixtures = [{
      status: 'PLAYED',
      stats: {
        apps: 1,
        subs: 1,
        gls: 1,
        tb: 1,
        sb: 1,
        asts: 1,
        ycard: 1,
        rcard: 1,
        cs: 1,
        con: 1,
        pensv: 1
      }
    },
    {
      status: 'PLAYED',
      stats: {
        apps: 1,
        subs: 1,
        gls: 1,
        tb: 1,
        sb: 1,
        asts: 1,
        ycard: 1,
        rcard: 1,
        cs: 1,
        con: 1,
        pensv: 1
      }
    }];
    expect(analyzeFixtures(fixtures)).to.deep.equal({
      apps: { total: 2, avg: 1, max: 1, min: 1 },
      subs: { total: 2, avg: 1, max: 1, min: 1 },
      gls: { total: 2, avg: 1, max: 1, min: 1 },
      tb: { total: 2, avg: 1, max: 1, min: 1 },
      sb: { total: 2, avg: 1, max: 1, min: 1 },
      asts: { total: 2, avg: 1, max: 1, min: 1 },
      ycard: { total: 2, avg: 1, max: 1, min: 1 },
      rcard: { total: 2, avg: 1, max: 1, min: 1 },
      cs: { total: 2, avg: 1, max: 1, min: 1 },
      con: { total: 2, avg: 1, max: 1, min: 1 },
      pensv: { total: 2, avg: 1, max: 1, min: 1 },
    });
  });

  it('should return stats with after a couple fixtures', () => {
    const fixtures = [{
      status: 'PLAYED',
      stats: {
        apps: 1,
        subs: 1,
        gls: 1,
        tb: 1,
        sb: 1,
        asts: 1,
        ycard: 1,
        rcard: 1,
        cs: 1,
        con: 1,
        pensv: 1
      }
    },
    {
      status: 'PLAYED',
      stats: {
        apps: 2,
        subs: 2,
        gls: 2,
        tb: 2,
        sb: 2,
        asts: 2,
        ycard: 2,
        rcard: 2,
        cs: 2,
        con: 2,
        pensv: 2
      }
    }];
    expect(analyzeFixtures(fixtures)).to.deep.equal({
      apps: { total: 3, avg: 1.5, max: 2, min: 1 },
      subs: { total: 3, avg: 1.5, max: 2, min: 1 },
      gls: { total: 3, avg: 1.5, max: 2, min: 1 },
      tb: { total: 3, avg: 1.5, max: 2, min: 1 },
      sb: { total: 3, avg: 1.5, max: 2, min: 1 },
      asts: { total: 3, avg: 1.5, max: 2, min: 1 },
      ycard: { total: 3, avg: 1.5, max: 2, min: 1 },
      rcard: { total: 3, avg: 1.5, max: 2, min: 1 },
      cs: { total: 3, avg: 1.5, max: 2, min: 1 },
      con: { total: 3, avg: 1.5, max: 2, min: 1 },
      pensv: { total: 3, avg: 1.5, max: 2, min: 1 },
    });
  });
});
