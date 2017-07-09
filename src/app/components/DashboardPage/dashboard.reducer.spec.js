import {expect} from '../../../../tests/config/test.helper';
import Chance from 'chance';

import dashboardReducer from './dashboard.reducer';
import * as actions from './dashboard.actions';

const chance = new Chance();
let fakeState;
let fakeKey;
let fakeValue;
let fakeAction;

describe('dashboard.reducer', () => {
  beforeEach(() => {
    fakeKey = chance.word();
    fakeValue = chance.word();
    fakeAction = chance.word();
    fakeState = {[fakeKey]: fakeValue};
  });

  it('will always return given state by default', () => {
    expect(dashboardReducer(fakeState, {})).to.equal(fakeState, 'State should always be returned');
  });

  it('will return update state and payload if action is fulfilled', () => {
    const type = `${actions.FETCH_DASHBOARD_DATA}_FULFILLED`;
    const status = chance.integer();
    const payload = {data: {getDashboard: {message: chance.sentence()}}};
    const result = dashboardReducer(fakeState, {type, status, payload});
    expect(result[fakeKey]).to.deep.equal(fakeValue, 'State should be loading');
    expect(result.data).to.deep.equal(payload.data.getDashboard.message, 'State should be updated');
  });
});
