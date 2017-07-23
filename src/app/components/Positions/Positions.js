import './positions.scss';

export const availablePositions = ['unknown', 'GK', 'FB', 'CB', 'WM', 'CM', 'STR'];

export const positionMapping = {
  unknown: { label: 'Unknown', order: 0, statsFields: [] },
  gks: { label: 'GK/S', order: 1, statsFields: ['gk', 'sub'] },
  cb: { label: 'CB', order: 2, statsFields: ['cbleft', 'cbright'] },
  fb: { label: 'FB', order: 3, statsFields: ['fbleft', 'fbright'] },
  cm: { label: 'Mid', order: 4, statsFields: ['cmleft', 'cmright'] },
  wm: { label: 'AM', order: 5, statsFields: ['wmleft', 'wmright'] },
  str: { label: 'STR', order: 6, statsFields: ['strleft', 'strright'] },
};

export const playerPositions = {
  unknown: { label: 'Unknown', order: 0, hiddenFromManager: true },
  GK: { label: 'GK', order: 1 },
  FB: { label: 'FB', order: 2 },
  CB: { label: 'CB', order: 3 },
  WM: { label: 'WM', order: 4 },
  CM: { label: 'CM', order: 5 },
  STR: { label: 'STR', order: 6 }
};
