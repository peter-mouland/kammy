import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DivisionsComponent from './Divisions.component';
import { assignTeamToDivision, updateTeam } from './division.actions';

class Divisions extends React.Component {
  // static needs = [fetchSeasons];

  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    const { router: { route: { match } } } = this.context;
    return (<DivisionsComponent match={ match } { ...this.props } />);
  }
}

function mapStateToProps(state) {
  return {
    seasonUsers: state.seasons.seasonUsers,
    seasons: state.seasons.data,
    stats: state.stats.data,
    statsErrors: state.stats.errors,
    seasonAdded: state.seasons.seasonAdded,
    divisionAdded: state.seasons.divisionAdded,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  {
    assignTeamToDivision,
    updateTeam
  }
)(Divisions);
