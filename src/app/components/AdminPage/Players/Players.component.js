import React from 'react';

import Auth from '../../../authentication/auth-helper';
import PlayerAdminOptions from './PlayerAdminOptions';
import { UPDATE_PLAYERS } from './players.actions';

export default class Players extends React.Component {
  importPlayers = () => {
    this.props.importPlayers();
  }

  updatePlayers = (playerUpdates) => {
    this.props.updatePlayers({ playerUpdates });
  }

  render() {
    const { loading, players = [] } = this.props;
    const updatingPlayer = loading === UPDATE_PLAYERS;

    if (!Auth.isAdmin()) {
      return <p>You're not admin!</p>;
    }
    if (!players.length) {
      return (
        <section className="admin__panel admin__panel--players">
          <div className="admin-options">
            <p>No players found.</p>
            <button onClick={ this.importPlayers }>Initialise</button>
          </div>
        </section>
      );
    }

    return (
      <section className="admin__panel admin__panel--players">
        <PlayerAdminOptions
          saving={ updatingPlayer }
          saveUpdates={ this.updatePlayers }
        />
      </section>
    );
  }
}
