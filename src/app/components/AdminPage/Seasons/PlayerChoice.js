import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchPlayers } from '../admin-page.actions';
import PlayerChoiceComponent from './PlayerChoice.component';

class PlayerChoice extends React.Component {
  static propTypes = {
    players: PropTypes.array
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
    return (<PlayerChoiceComponent { ...this.props} />);
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
)(PlayerChoice);
