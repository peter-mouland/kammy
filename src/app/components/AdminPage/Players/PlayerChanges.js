import React from 'react';

const flattenUpdates = (updates) => (Object.keys(updates)).map((_id) => {
  const update = { ...updates };
  delete update[_id].gameWeek;
  delete update[_id].season;
  return update[_id];
});

export default ({ players, updates, saveUpdates }) => (
  <div className="updates">
    {(Object.keys(updates)).map((_id) => {
      const update = updates[_id];
      const player = players[_id];
      return (
        <div key={ _id }>
          Update {player.name}:
          <ul>
            {(Object.keys(update))
              .filter((attribute) => ['code', 'pos', 'club', 'name', 'isHidden'].includes(attribute))
              .filter((attribute) => player[attribute] !== update[attribute])
              .map((attribute) => (
                attribute === 'isHidden'
                  ? <li key={attribute}>{!player[attribute] ? 'is not hidden to hidden' : 'is hidden to not hidden'}</li>
                  : <li key={attribute}>{player[attribute]} to {update[attribute]}</li>
              ))
            }
          </ul>
        </div>
      );
    })}
    <button onClick={ () => saveUpdates(flattenUpdates(updates)) }>Save Updates</button>
  </div>
);
