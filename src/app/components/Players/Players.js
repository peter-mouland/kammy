import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { fetchPlayers } from './players.actions';
import PlayersComponent from './Players.component';

debug('kammy:Players');

class Players extends React.Component {
  static needs = [fetchPlayers];

  render() {
    return <PlayersComponent { ...this.props } />;
  }
}

function mapStateToProps(state) {
  return {
    players: state.players.data,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchPlayers }
)(Players);
