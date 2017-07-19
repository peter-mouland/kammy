import React from 'react';
import { connect } from 'react-redux';

import PlayersComponent from './Players.component';
import { updatePlayers, importPlayers } from '../../Players/players.actions';

class Players extends React.Component {
  render() {
    return (<PlayersComponent { ...this.props } />);
  }
}

function mapStateToProps(state) {
  return {
    players: state.players.data,
    updating: state.players.updating,
    importing: state.players.importing,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  {
    importPlayers,
    updatePlayers,
  }
)(Players);
