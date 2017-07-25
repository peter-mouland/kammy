import { expect } from 'chai';
import * as calculatePoints from './calculatePoints';

let position;

describe('calculatePoints', () => {
  context('for any player', ()=>{
    it('returns 3 points for each start', () => {
      expect(calculatePoints.forStarting(1)).to.eql(3);
      expect(calculatePoints.forStarting(0)).to.eql(0);
      expect(calculatePoints.forStarting(10)).to.eql(30);
    });

    it('returns 1 points for each sub', () => {
      expect(calculatePoints.forSub(1)).to.eql(1);
      expect(calculatePoints.forSub(0)).to.eql(0);
      expect(calculatePoints.forSub(10)).to.eql(10);
    });

    it('returns 3 points for each assist', () => {
      expect(calculatePoints.forAssists(1)).to.eql(3);
      expect(calculatePoints.forAssists(0)).to.eql(0);
      expect(calculatePoints.forAssists(10)).to.eql(30);
    });

    it('returns -2 points for each yellow card', () => {
      expect(calculatePoints.forYellowCards(1)).to.eql(-2);
      expect(calculatePoints.forYellowCards(0)).to.eql(0);
      expect(calculatePoints.forYellowCards(10)).to.eql(-20);
    });

    it('returns -5 points for each red card', () => {
      expect(calculatePoints.forRedCards(1)).to.eql(-5);
      expect(calculatePoints.forRedCards(0)).to.eql(0);
      expect(calculatePoints.forRedCards(10)).to.eql(-50);
    });
  });

  context('when a GK has points calculated', ()=>{

    beforeEach(()=>{
      position = 'GK';
    });

    it('returns 10 points for each goal', () => {
      expect(calculatePoints.forGoals(1, position)).to.eql(10);
      expect(calculatePoints.forGoals(0, position)).to.eql(0);
      expect(calculatePoints.forGoals(10, position)).to.eql(100);
    });

    it('returns 5 points for each clean sheet', () => {
      expect(calculatePoints.forCleanSheet(1, position)).to.eql(5);
      expect(calculatePoints.forCleanSheet(0, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(10, position)).to.eql(50);
    });

    it('returns -1 points for each conceeded', () => {
      expect(calculatePoints.forConceded(1, position)).to.eql(-1);
      expect(calculatePoints.forConceded(0, position)).to.eql(0);
      expect(calculatePoints.forConceded(10, position)).to.eql(-10);
    });

    it('returns +5 points for each pen saved', () => {
      expect(calculatePoints.forPenaltiesSaved(1, position)).to.eql(5);
      expect(calculatePoints.forPenaltiesSaved(0, position)).to.eql(0);
      expect(calculatePoints.forPenaltiesSaved(10, position)).to.eql(50);
    });

    it('return a correct totals', () => {
      const stats = {
        apps: 1, subs: 1, mom: 1, gls: 1, tb: 1, asts: 1, cs: 1, con: 1, pensv: 1, ycard: 1, rcard: 1
      };
      const points = calculatePoints.calculateTotalPoints(stats, position);
      expect(points.apps).to.eql(3);
      expect(points.subs).to.eql(1);
      expect(points.mom).to.eql(0);
      expect(points.gls).to.eql(10);
      expect(points.asts).to.eql(3);
      expect(points.tb).to.eql(0);
      expect(points.cs).to.eql(5);
      expect(points.con).to.eql(-1);
      expect(points.pensv).to.eql(5);
      expect(points.ycard).to.eql(-2);
      expect(points.rcard).to.eql(-5);
      expect(points.total).to.eql(19);
    });

    it('return a correct gameWeek points', () => {
      const externalSeasonStats = {
        apps: 3, subs: 3, mom: 3, gls: 3, tb: 3, asts: 3, cs: 3, con: 3, pensv: 3, ycard: 3, rcard: 3
      };
      const savedSeasonStats = {
        apps: 2, subs: 2, mom: 2, gls: 2, tb: 2, asts: 2, cs: 2, con: 2, pensv: 2, ycard: 2, rcard: 2
      };
      const savedGameWeekStats = {
        apps: 1, subs: 1, mom: 1, gls: 1, tb: 1, asts: 1, cs: 1, con: 1, pensv: 1, ycard: 1, rcard: 1
      };
      const gameWeek = calculatePoints.calculateGameWeek(externalSeasonStats, savedSeasonStats, savedGameWeekStats, position);
      const points = gameWeek.points;
      const stats = gameWeek.stats;
      expect(stats.apps).to.eql(2);
      expect(stats.subs).to.eql(2);
      expect(stats.mom).to.eql(2);
      expect(stats.gls).to.eql(2);
      expect(stats.asts).to.eql(2);
      expect(stats.tb).to.eql(2);
      expect(stats.cs).to.eql(2);
      expect(stats.con).to.eql(2);
      expect(stats.pensv).to.eql(2);
      expect(stats.ycard).to.eql(2);
      expect(stats.rcard).to.eql(2);
      expect(points.apps).to.eql(6);
      expect(points.apps).to.eql(6);
      expect(points.subs).to.eql(2);
      expect(points.mom).to.eql(0);
      expect(points.gls).to.eql(20);
      expect(points.asts).to.eql(6);
      expect(points.tb).to.eql(0);
      expect(points.cs).to.eql(10);
      expect(points.con).to.eql(-2);
      expect(points.pensv).to.eql(10);
      expect(points.ycard).to.eql(-4);
      expect(points.rcard).to.eql(-10);
      expect(points.total).to.eql(38);
    });
  });

  context('when a FB has points calculated', ()=>{
    beforeEach(()=>{
      position = 'FB';
    });

    it('returns 8 points for each goal', () => {
      expect(calculatePoints.forGoals(1, position)).to.eql(8);
      expect(calculatePoints.forGoals(0, position)).to.eql(0);
      expect(calculatePoints.forGoals(10, position)).to.eql(80);
    });

    it('returns 5 points for each clean sheet', () => {
      expect(calculatePoints.forCleanSheet(1, position)).to.eql(5);
      expect(calculatePoints.forCleanSheet(0, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(10, position)).to.eql(50);
    });

    it('returns -1 points for each clean sheet', () => {
      expect(calculatePoints.forConceded(1, position)).to.eql(-1);
      expect(calculatePoints.forConceded(0, position)).to.eql(0);
      expect(calculatePoints.forConceded(10, position)).to.eql(-10);
    });

    it('return a correct total', () => {
      const stats = {
        apps: 1, subs: 1, mom: 1, gls: 1, tb: 1, asts: 1, cs: 1, con: 1, pensv: 1, ycard: 1, rcard: 1
      };
      const points = calculatePoints.calculateTotalPoints(stats, position);
      expect(points.apps).to.eql(3);
      expect(points.subs).to.eql(1);
      expect(points.mom).to.eql(0);
      expect(points.gls).to.eql(8);
      expect(points.asts).to.eql(3);
      expect(points.tb).to.eql(0);
      expect(points.cs).to.eql(5);
      expect(points.con).to.eql(-1);
      expect(points.pensv).to.eql(5);
      expect(points.ycard).to.eql(-2);
      expect(points.rcard).to.eql(-5);
      expect(points.total).to.eql(17);
    });
  });

  context('when a CB has points calculated', ()=>{
    beforeEach(()=>{
      position = 'CB';
    });

    it('returns 8 points for each goal', () => {
      expect(calculatePoints.forGoals(1, position)).to.eql(8);
      expect(calculatePoints.forGoals(0, position)).to.eql(0);
      expect(calculatePoints.forGoals(10, position)).to.eql(80);
    });

    it('returns 5 points for each clean sheet', () => {
      expect(calculatePoints.forCleanSheet(1, position)).to.eql(5);
      expect(calculatePoints.forCleanSheet(0, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(10, position)).to.eql(50);
    });

    it('returns -1 points for each clean sheet', () => {
      expect(calculatePoints.forConceded(1, position)).to.eql(-1);
      expect(calculatePoints.forConceded(0, position)).to.eql(0);
      expect(calculatePoints.forConceded(10, position)).to.eql(-10);
    });

    it('return a correct total', () => {
      const stats = {
        apps: 1, subs: 1, mom: 1, gls: 1, tb: 1, asts: 1, cs: 1, con: 1, pensv: 1, ycard: 1, rcard: 1
      };
      const points = calculatePoints.calculateTotalPoints(stats, position);
      expect(points.apps).to.eql(3);
      expect(points.subs).to.eql(1);
      expect(points.mom).to.eql(0);
      expect(points.gls).to.eql(8);
      expect(points.asts).to.eql(3);
      expect(points.tb).to.eql(0);
      expect(points.cs).to.eql(5);
      expect(points.con).to.eql(-1);
      expect(points.pensv).to.eql(5);
      expect(points.ycard).to.eql(-2);
      expect(points.rcard).to.eql(-5);
      expect(points.total).to.eql(17);
    });
  });

  context('when a MID has points calculated', ()=>{
    beforeEach(()=>{
      position = 'MID';
    });
    it('returns 6 points for each goal', () => {
      expect(calculatePoints.forGoals(1, position)).to.eql(6);
      expect(calculatePoints.forGoals(0, position)).to.eql(0);
      expect(calculatePoints.forGoals(10, position)).to.eql(60);
    });

    it('returns 3 points for Tackle Bonus', () => {
      expect(calculatePoints.forTackleBonus(1, position)).to.eql(3);
      expect(calculatePoints.forTackleBonus(0, position)).to.eql(0);
      expect(calculatePoints.forTackleBonus(10, position)).to.eql(30);
    });

    it('returns 0 points for each clean sheet', () => {
      expect(calculatePoints.forCleanSheet(1, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(0, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(10, position)).to.eql(0);
    });

    it('returns 0 points for each conceded', () => {
      expect(calculatePoints.forConceded(1, position)).to.eql(0);
      expect(calculatePoints.forConceded(0, position)).to.eql(0);
      expect(calculatePoints.forConceded(10, position)).to.eql(0);
    });

    it('return a correct total', () => {
      const stats = {
        apps: 1, subs: 1, mom: 1, gls: 1, tb: 1, asts: 1, cs: 1, con: 1, pensv: 1, ycard: 1, rcard: 1
      };
      const points = calculatePoints.calculateTotalPoints(stats, position);
      expect(points.apps).to.eql(3);
      expect(points.subs).to.eql(1);
      expect(points.mom).to.eql(0);
      expect(points.gls).to.eql(6);
      expect(points.asts).to.eql(3);
      expect(points.tb).to.eql(3);
      expect(points.cs).to.eql(0);
      expect(points.con).to.eql(0);
      expect(points.pensv).to.eql(5);
      expect(points.ycard).to.eql(-2);
      expect(points.rcard).to.eql(-5);
      expect(points.total).to.eql(11);
    });
  });

  context('when a AM has points calculated', ()=>{
    beforeEach(()=>{
      position = 'AM';
    });

    it('returns 5 points for each goal', () => {
      expect(calculatePoints.forGoals(1, position)).to.eql(5);
      expect(calculatePoints.forGoals(0, position)).to.eql(0);
      expect(calculatePoints.forGoals(10, position)).to.eql(50);
    });

    it('returns 0 points for each clean sheet', () => {
      expect(calculatePoints.forCleanSheet(1, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(0, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(10, position)).to.eql(0);
    });

    it('returns 0 points for each clean sheet', () => {
      expect(calculatePoints.forConceded(1, position)).to.eql(0);
      expect(calculatePoints.forConceded(0, position)).to.eql(0);
      expect(calculatePoints.forConceded(10, position)).to.eql(0);
    });

    it('return a correct total', () => {
      const stats = {
        apps: 1, subs: 1, mom: 1, gls: 1, tb: 1, asts: 1, cs: 1, con: 1, pensv: 1, ycard: 1, rcard: 1
      };
      const points = calculatePoints.calculateTotalPoints(stats, position);
      expect(points.apps).to.eql(3);
      expect(points.subs).to.eql(1);
      expect(points.mom).to.eql(0);
      expect(points.gls).to.eql(5);
      expect(points.asts).to.eql(3);
      expect(points.tb).to.eql(0);
      expect(points.cs).to.eql(0);
      expect(points.con).to.eql(0);
      expect(points.pensv).to.eql(5);
      expect(points.ycard).to.eql(-2);
      expect(points.rcard).to.eql(-5);
      expect(points.total).to.eql(10);
    });
  });

  context('when a STR has points calculated', ()=>{
    beforeEach(()=>{
      position = 'STR';
    });

    it('returns 4 points for each goal', () => {
      expect(calculatePoints.forGoals(1, position)).to.eql(4);
      expect(calculatePoints.forGoals(0, position)).to.eql(0);
      expect(calculatePoints.forGoals(10, position)).to.eql(40);
    });

    it('returns 0 points for each clean sheet', () => {
      expect(calculatePoints.forCleanSheet(1, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(0, position)).to.eql(0);
      expect(calculatePoints.forCleanSheet(10, position)).to.eql(0);
    });

    it('returns 0 points for each clean sheet', () => {
      expect(calculatePoints.forConceded(1, position)).to.eql(0);
      expect(calculatePoints.forConceded(0, position)).to.eql(0);
      expect(calculatePoints.forConceded(10, position)).to.eql(0);
    });

    it('return a correct total', () => {
      const stats = {
        apps: 1, subs: 1, mom: 1, gls: 1, tb: 1, asts: 1, cs: 1, con: 1, pensv: 1, ycard: 1, rcard: 1
      };
      const points = calculatePoints.calculateTotalPoints(stats, position);
      expect(points.apps).to.eql(3);
      expect(points.subs).to.eql(1);
      expect(points.mom).to.eql(0);
      expect(points.gls).to.eql(4);
      expect(points.asts).to.eql(3);
      expect(points.tb).to.eql(0);
      expect(points.cs).to.eql(0);
      expect(points.con).to.eql(0);
      expect(points.pensv).to.eql(5);
      expect(points.ycard).to.eql(-2);
      expect(points.rcard).to.eql(-5);
      expect(points.total).to.eql(9);
    });
  });
});
