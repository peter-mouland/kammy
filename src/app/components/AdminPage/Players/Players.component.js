import React from 'react';

import Auth from '../../../authentication/auth-helper';
import PlayerAdminOptions from './PlayerAdminOptions';
import { UPDATE_PLAYERS, FETCH_PLAYERS } from './players.actions';

export default class Players extends React.Component {
  componentDidMount() {
    if (!this.props.players) {
      this.props.fetchPlayers();
    }
  }

  importPlayers = () => {
    this.props.importPlayers();
  }

  updatePlayers = (playerUpdates) => {
    this.props.updatePlayers({ playerUpdates });
  }

  render() {
    const { loading, players = [] } = this.props;

    const updatingPlayer = loading === UPDATE_PLAYERS;
    const loadingPlayers = loading === FETCH_PLAYERS;

    if (!Auth.isAdmin()) {
      return <p>You're not admin!</p>;
    }
    if (loadingPlayers) return <p>Loading</p>;
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
      <PlayerAdminOptions
        players={ players }
        saving={ updatingPlayer }
        saveUpdates={ this.updatePlayers }
      />
    );
  }
}
