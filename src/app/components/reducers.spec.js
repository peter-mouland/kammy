import { expect } from '../../../tests/config/test.helper';
import Chance from 'chance';

import * as reducers from './reducers';

const chance = new Chance();
let fakeState;
let fakeKey;
let fakeValue;
let fakeAction;

describe('reducers/index', () => {

  beforeEach(()=>{
    fakeKey = chance.word();
    fakeValue = chance.word();
    fakeAction = chance.word();
    fakeState = { [fakeKey]: fakeValue };
  });

  context('promise reducer will handle errors, loading and passing default state', () => {
    it('will always return given state by default', () => {
      const type = fakeAction;
      expect(reducers.promiseState(fakeState, { type })).to.equal(fakeState, 'State should always be returned');
    });

    it('will return loading state if action is pending', () => {
      const type = `${fakeAction}_PENDING`;
      const result = reducers.promiseState(fakeState, { type });
      expect(result.loading).to.deep.equal(fakeAction, 'State should be loading');
      expect(result[fakeKey]).to.deep.equal(fakeValue, 'State should still contain existing keys');
    });

    it('will return update state and payload if action is fulfilled', () => {
      const type = `${fakeAction}_FULFILLED`;
      const status = chance.integer();
      const payload = { data: { getDashboard: { message: chance.sentence() } } };
      const result = reducers.promiseState(fakeState, { type, status, payload });
      expect(result.loading).to.deep.equal(false, 'State should be updated');
      expect(result[fakeKey]).to.deep.equal(fakeValue, 'State should be loading');
      expect(result.status).to.deep.equal(status, 'State should be updated');
    });
  });
});
