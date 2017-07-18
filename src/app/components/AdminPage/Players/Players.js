import React from 'react';
import { connect } from 'react-redux';

import PlayersComponent from './Players.component';
import { updatePlayers, importPlayers, fetchPlayers } from '../../Players/players.actions';

class Players extends React.Component {
  static needs = [fetchPlayers];

  componentDidMount() {
    if (!this.props.players) {
      this.props.fetchPlayers();
    }
  }

  render() {
    return (<PlayersComponent { ...this.props } />);
  }
}

function mapStateToProps(state) {
  return {
    players: state.players.data,
    loading: state.players.loading,
    updating: state.players.updating,
    importing: state.players.importing,
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
