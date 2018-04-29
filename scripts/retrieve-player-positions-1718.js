#!/usr/bin/env node
import debug from 'debug';

import GoogleSpreadsheet from './lib/google-sheets';
import creds from './lib/google-sheets/google-generated-creds.json';
import json from './lib/json';

const log = debug('footy:retrieve-player-positions');

const createJsonObj = (item) => ({
  [`${item.surname}, ${item.firstname}`]: {
    code: item.skyid,
    pos: item.position,
    player: `${item.surname}, ${item.firstname}`,
    value: item.value,
    club: item.team,
    apps: 0,
    subs: 0,
    gls: 0,
    asts: 0,
    mom: 0,
    cs: 0,
    tb: 0,
    sb: 0,
    con: 0,
    pensv: 0,
    ycard: 0,
    rcard: 0,
  }
});

// for authorising a new sheet look: https://www.npmjs.com/package/google-spreadsheet
// probably easiest to make the sheet public
const spreadsheet = new GoogleSpreadsheet('1kj4HkXs2kjK__NZ8z9mmtHsg6C-fTQr7_MlUFdEKouw', creds);
const playerListSheet = spreadsheet.getWorksheet('Auto pick list');

playerListSheet
  .toJson(createJsonObj)
  .then((jsonData) => json.save(jsonData, './ff-1718.json'))
  .then(() => log('done.'))
  .catch((e) => log(e));
