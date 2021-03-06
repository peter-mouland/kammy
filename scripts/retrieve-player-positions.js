#!/usr/bin/env node
import debug from 'debug';

import GoogleSpreadsheet from './lib/google-sheets';
import creds from './lib/google-sheets/google-generated-creds.json';
import json from './lib/json';

const log = debug('footy:retrieve-player-positions');

const createJsonObj = (item) => ({
  [item.player]: {
    new: item.new,
    code: item.code,
    pos: item.position,
    player: item.player,
    club: item.club,
  }
});

// for authorising a new sheet look: https://www.npmjs.com/package/google-spreadsheet
// probably easiest to make the sheet public
const spreadsheet = new GoogleSpreadsheet('1x2qD0aS6W-MeARu6QT0YthgLV91-Hmlip5_Gut2nEBI', creds);
const playerListSheet = spreadsheet.getWorksheet('Players');

playerListSheet
  .toJson(createJsonObj)
  .then((jsonData) => json.save(jsonData, './src/assets/ff-1718.next.json'))
  .then(() => log('done.'))
  .catch((e) => log(e));
