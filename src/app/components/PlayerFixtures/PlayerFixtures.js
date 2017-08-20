import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { fetchPlayerFixtures } from '../Players/players.actions';
import PlayerFixturesComponent from './PlayerFixtures.component';

debug('kammy:PlayerFixtures');

class PlayerFixtures extends React.Component {
  componentWillReceiveProps(props) {
    if (
      props.showFixtures
        && props.showFixtures !== this.props.showFixtures
        && (!this.props.player || !this.props.player[props.showFixtures])
    ) {
      this.props.fetchPlayerFixtures({ code: props.showFixtures });
    }
  }

  render() {
    return <PlayerFixturesComponent { ...this.props } />;
  }
}

function mapStateToProps(state) {
  return {
    player: state.players.playerFixtures,
    loading: state.players.loading,
    errors: state.players.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchPlayerFixtures }
)(PlayerFixtures);
