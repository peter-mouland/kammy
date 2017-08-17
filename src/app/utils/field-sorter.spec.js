import {expect, sinon} from '../../../tests/config/test.helper';

import fieldSorter from './field-sorter';

const seasonUsers = require('../../../tests/test-servers/fixtures/season-users.json');

const sandbox = sinon.sandbox.create();
let teams = seasonUsers.reduce((prev, curr) => prev.concat(curr.teams), []);

describe('field-sorter', () => {
  beforeEach(() => {
    teams = seasonUsers.reduce((prev, curr) => prev.concat(curr.teams), []);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should sort by a single field', () => {
    const arr = [
      {name: 'z'}, {name: 'x'}, {name: 'a'}
    ];
    expect(arr.sort(fieldSorter(['name']))).to.deep.equal([
      {name: 'a'}, {name: 'x'}, {name: 'z'}
    ]);
  });

  it('should sort by a single field preserving original data order', () => {
    const arr = [
      {name: 'z', surname: 'zxy'}, {name: 'z', surname: 'abc'},
      {name: 'a',surname: 'b'}
    ];
    expect(arr.sort(fieldSorter(['name']))).to.deep.equal([
      {name: 'a', surname: 'b'},
      {name: 'z',surname: 'zxy'},
      {name: 'z', surname: 'abc'}
    ]);
  });

  it('should sort by multiple fields', () => {
    const arr = [
      {name: 'z', surname: 'zxy'},
      {name: 'z', surname: 'abc'},
      {name: 'a',surname: 'b'}
    ];
    expect(arr.sort(fieldSorter(['name', 'surname']))).to.deep.equal([
      {name: 'a',surname: 'b'},
      {name: 'z', surname: 'abc'},
      {name: 'z', surname: 'zxy'}
    ]);
  });

  it('should sort by a sub-field preserving original array order', () => {
    const arr = [
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'z', surname: 'abc'}},
      {name: {forename: 'a', surname: 'b'}}
    ];
    expect(arr.sort(fieldSorter(['name.forename']))).to.deep.equal([
      {name: {forename: 'a',surname: 'b'}},
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'z', surname: 'abc'}}
    ]);
  });

  it('should sort by multiple sub-fields', () => {
    const arr = [
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'z', surname: 'abc'}},
      {name: {forename: 'a', surname: 'b'}}
    ];
    expect(arr.sort(fieldSorter(['name.forename', 'name.surname']))).to.deep.equal([
      {name: {forename: 'a',surname: 'b'}},
      {name: {forename: 'z', surname: 'abc'}},
      {name: {forename: 'z', surname: 'zxy'}}
    ]);
  });

  it('should sort by multiple sub-fields with null values', () => {
    const arr = [
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'z', surname: null}},
      {name: {forename: 'a', surname: 'b'}}
    ];
    expect(arr.sort(fieldSorter(['name.forename', 'name.surname']))).to.deep.equal([
      {name: {forename: 'a',surname: 'b'}},
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'z', surname: null}}
    ]);
  });

  it('should sort by multiple sub-fields with more null values', () => {
    const arr = [
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'a', surname: 'a'}},
      {name: {forename: 'z', surname: null}},
      {name: {forename: 'a', surname: 'b'}},
      {name: {forename: 'z', surname: 'b'}},
    ];
    expect(arr.sort(fieldSorter(['name.forename', 'name.surname']))).to.deep.equal([
      {name: {forename: 'a', surname: 'a'}},
      {name: {forename: 'a', surname: 'b'}},
      {name: {forename: 'z', surname: 'b'}},
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'z', surname: null}},
    ]);
  });

  it('should sort by multiple sub-fields with more null values', () => {
    const arr = [
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'a', surname: 'a'}},
      {name: {forename: 'z', surname: null}},
      {name: {forename: null, surname: null}},
      {name: {forename: 'a', surname: 'b'}},
      {name: {forename: 'z', surname: 'b'}},
    ];
    expect(arr.sort(fieldSorter(['name.forename', 'name.surname']))).to.deep.equal([
      {name: {forename: 'a', surname: 'a'}},
      {name: {forename: 'a', surname: 'b'}},
      {name: {forename: 'z', surname: 'b'}},
      {name: {forename: 'z', surname: 'zxy'}},
      {name: {forename: 'z', surname: null}},
      {name: {forename: null, surname: null}}
    ]);
  });
});
