import React from 'react';
import bemHelper from 'react-bem-helper';

import Interstitial from '../../Interstitial/Interstitial';
import Players from '../../Players/Players';

import '../../Players/players.scss';

const bem = bemHelper({ name: 'player-admin' });

const flattenUpdates = (updates) => (Object.keys(updates)).map((_id) => {
  delete updates[_id].gameWeek;
  delete updates[_id].total;
  return updates[_id];
});

const DraftUpdates = ({ players, updates, saveUpdates }) => <div className="updates">
  {(Object.keys(updates)).map((_id) => {
    const update = updates[_id];
    const player = players[_id];
    return (
      <div key={ _id }>
          Update {player.name}:
        <ul>
          {(Object.keys(update))
            .filter((attribute) => ['code', 'pos', 'club', 'name'].includes(attribute))
            .filter((attribute) => player[attribute] !== update[attribute])
            .map((attribute) => (
              <li key={attribute}>{player[attribute]} to {update[attribute]}</li>
            ))
          }
        </ul>
      </div>
    );
  }
  )}
  <button onClick={ () => saveUpdates(flattenUpdates(updates)) }>Save Updates</button>
</div>;

class PlayerAdminOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      playerUpdates: {},
      originalPlayers: {}
    };
  }

  saveToState = ({ playerUpdates, originalPlayers }) => {
    this.setState({ playerUpdates, originalPlayers });
  }

  render() {
    const { children, saveUpdates, saving, ...props } = this.props;
    const { playerUpdates, originalPlayers } = this.state;

    return (
      <div
        className="admin-options"
        { ...props }
        data-test="admin-options--season"
      >
        <div { ...bem(null, 'admin', 'admin-option') }>
          <Players
            editable
            onChange={ this.saveToState }
            playerUpdates={ playerUpdates }
            originalPlayers={ originalPlayers }
          />
        </div>

        <div className="admin-option">
          <h2>Updates</h2>
          { saving ? <Interstitial small>Saving</Interstitial> : null }
          { !saving && (Object.keys(playerUpdates)).length > 0
            ? <DraftUpdates
              updates={ playerUpdates }
              players={ originalPlayers }
              saveUpdates={ (updates) => {
                saveUpdates(updates);
                this.setState({ playerUpdates: {} });
              }} />
            : <em>none</em>
          }
        </div>
        <div className="admin-option admin-option__btn">
          { children }
        </div>
      </div>
    );
  }
}

export default PlayerAdminOptions;
