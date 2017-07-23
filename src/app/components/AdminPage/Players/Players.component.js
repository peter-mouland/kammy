import React from 'react';
import bemHelper from 'react-bem-helper';

import Auth from '../../../authentication/auth-helper';
import Interstitial from '../../Interstitial/Interstitial';
import Players from '../../Players/Players';
import PlayerChanges from './PlayerChanges';

import '../../Players/players.scss';

const bem = bemHelper({ name: 'player-admin' });

export default class AdminPlayers extends React.Component {
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

  importPlayers = () => {
    this.props.importPlayers();
  }

  updatePlayers = (playerUpdates) => {
    this.props.updatePlayers({ playerUpdates });
  }

  render() {
    const { importing, updating } = this.props;
    const { playerUpdates, originalPlayers } = this.state;

    if (!Auth.isAdmin()) {
      return <p>You're not admin!</p>;
    }

    if (importing) {
      return <Interstitial>Importing Players...</Interstitial>;
    }
    return (
      <section className="admin__panel admin__panel--players">
        <div className="admin-options" data-test="admin-options--players">
          <div { ...bem(null, 'admin', 'admin-option') }>
            <Players
              type="import"
              editable
              onChange={ this.saveToState }
              playerUpdates={ playerUpdates }
              originalPlayers={ originalPlayers }
            />
          </div>

          <div className="admin-option">
            <h2>Import</h2>
            <p>
              Importing players will update player details to match Sky (<em>not position</em>)
              e.g. The club the player belong's to may change.
            </p>
            <p>
              <button onClick={ this.importPlayers }>Import New Players From Sky</button>
            </p>
            <h2>Updates</h2>
            { updating ? <Interstitial small>Saving</Interstitial> : null }
            { !updating && (Object.keys(playerUpdates)).length > 0
              ? <PlayerChanges
                updates={ playerUpdates }
                players={ originalPlayers }
                saveUpdates={ (updates) => {
                  this.updatePlayers(updates);
                  this.setState({ playerUpdates: {} });
                }} />
              : <em>No updates pending</em>
            }
          </div>
        </div>
      </section>
    );
  }
}
