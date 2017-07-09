import React from 'react';
import { connect } from 'react-redux';

import PlayersComponent from './Players.component';
import { fetchPlayers, updatePlayers, importPlayers } from './players.actions';


class Players extends React.Component {
  static needs = [fetchPlayers];

  render() {
    return (<PlayersComponent { ...this.props } />);
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
  {
    fetchPlayers,
    importPlayers,
    updatePlayers,
  }
)(Players);
