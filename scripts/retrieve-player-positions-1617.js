#!/usr/bin/env node
import debug from 'debug';

import GoogleSpreadsheet from './lib/google-sheets';
import creds from './lib/google-sheets/google-generated-creds.json';
import json from './lib/json';

const log = debug('footy:retrieve-player-positions');

const createJsonObj = (item) => log(item) || ({
  [item.player]: {
    code: item.code,
    pos: item.pos,
    player: item.player,
    club: item.club,
  }
});

const spreadsheet = new GoogleSpreadsheet('1x2qD0aS6W-MeARu6QT0YthgLV91-Hmlip5_Gut2nEBI', creds);
const playerListSheet = spreadsheet.getWorksheet('player list');

playerListSheet
  .toJson(createJsonObj)
    .then((jsonData) => json.save(jsonData, 'src/assets/ff-1617.json'))
    .then(() => log('done.'))
    .catch(e => log(e));
