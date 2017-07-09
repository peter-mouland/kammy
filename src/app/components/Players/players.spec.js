import {expect} from '../../../../tests/config/test.helper';
import Chance from 'chance';

import playersReducer from './players.reducer';
import * as actions from './players.actions';

const chance = new Chance();
let fakeState;
let fakeKey;
let fakeValue;
let fakeAction;

describe('players reducer', () => {
  beforeEach(() => {
    fakeKey = chance.word();
    fakeValue = chance.word();
    fakeAction = chance.word();
    fakeState = {[fakeKey]: fakeValue};
  });

  it('will always return given state by default', () => {
    expect(playersReducer(fakeState, {})).to.equal(fakeState, 'State should always be returned');
  });

  it('will return update state and payload if action is fulfilled', () => {
    const type = `${actions.FETCH_PLAYERS}_FULFILLED`;
    const status = chance.integer();
    const payload = {data: {getDashboard: {message: chance.sentence()}}};
    const result = playersReducer(fakeState, {type, status, payload});
    expect(result[fakeKey]).to.deep.equal(fakeValue, 'State should be loading');
  });
});

