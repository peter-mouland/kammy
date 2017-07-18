import React from 'react';

import Auth from '../../../authentication/auth-helper';
import Interstitial from '../../Interstitial/Interstitial';
import PlayerAdminOptions from './PlayerAdminOptions';

export default class Players extends React.Component {
  importPlayers = () => {
    this.props.importPlayers();
  }

  updatePlayers = (playerUpdates) => {
    this.props.updatePlayers({ playerUpdates });
  }

  render() {
    const { loading, importing, updating, players = [] } = this.props;

    if (!Auth.isAdmin()) {
      return <p>You're not admin!</p>;
    }

    if (loading) {
      return <Interstitial>Loading Players...</Interstitial>;
    }

    if (importing) {
      return <Interstitial>Importing Players...</Interstitial>;
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
          saving={ updating }
          saveUpdates={ this.updatePlayers }
        />
      </section>
    );
  }
}
