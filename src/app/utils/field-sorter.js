import { playerPositions } from '../../config/positions';

function getNestedKey(obj, key) {
  const isNestedKey = key.indexOf('.') > -1;
  if (!isNestedKey) return obj[key];
  return key.split('.').reduce((prev, curr) => prev[curr], obj);
}

export default function fieldSorter(fields) {
  return (prevPlayer, currPlayer) => fields
    .map((field) => {
      let dir = 1;
      const desc = field[0] === '-';
      if (desc) {
        dir = -1;
        field = field.substring(1);
      }
      const attrA = (field === 'pos') ? playerPositions[prevPlayer.pos].order : getNestedKey(prevPlayer, field);
      const attrB = (field === 'pos') ? playerPositions[currPlayer.pos].order : getNestedKey(currPlayer, field);
      if (attrA > attrB) return dir;
      if (attrA === null) return dir;
      if (attrB === null) return -(dir);
      return (attrA < attrB) ? -(dir) : 0;
    })
    .reduce((prev, curr) => prev || curr, 0);
}
