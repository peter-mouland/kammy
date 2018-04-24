module.exports.positionMapping = {
  unknown: {
    label: 'Unknown', order: 0, statsFields: [], hiddenFromManager: true
  },
  gks: { label: 'GK/S', order: 1, statsFields: ['gk', 'sub'] },
  cb: { label: 'CB', order: 2, statsFields: ['cbleft', 'cbright'] },
  fb: { label: 'FB', order: 3, statsFields: ['fbleft', 'fbright'] },
  mid: { label: 'MID', order: 4, statsFields: ['midleft', 'midright'] },
  am: { label: 'AM', order: 5, statsFields: ['amleft', 'amright'] },
  str: { label: 'FWD', order: 6, statsFields: ['strleft', 'strright'] },
};

module.exports.playerPositions = {
  unknown: { label: 'Unknown', order: 0, hiddenFromManager: true },
  GK: { label: 'GK', order: 1 },
  CB: { label: 'CB', order: 2 },
  FB: { label: 'FB', order: 3 },
  MID: { label: 'MID', order: 4 },
  AM: { label: 'AM', order: 5 },
  STR: { label: 'STR', order: 6 },
  SUB: { label: 'SUB', order: 7 },
};
