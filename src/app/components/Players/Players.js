import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debug from 'debug';

import { fetchPlayers } from './players.actions';
import PlayersComponent from './Players.component';

debug('kammy:Players');

class Players extends React.Component {
  static needs = [fetchPlayers];

  static propTypes = {
    players: PropTypes.array,
  };

  static defaultProps = {
    players: []
  };

  componentDidMount() {
    if (!this.props.players.length) {
      this.props.fetchPlayers();
    }
  }

  render() {
    return <PlayersComponent { ...this.props } />;
  }
}

function mapStateToProps(state) {
  return {
    players: state.players.data,
    loading: state.players.loading,
    errors: state.players.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchPlayers }
)(Players);
