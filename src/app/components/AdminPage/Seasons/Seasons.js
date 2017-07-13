import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SeasonsComponent from './Seasons.component';
import {
  fetchSeasons, updateSeason, addSeason, addDivision,
  fetchExternalStats, saveGameWeekStats, fetchUsersWithTeams
} from './seasons.actions';

class AdminPage extends React.Component {
  static needs = [fetchSeasons];

  componentDidMount() {
    if (!this.props.seasons) {
      this.props.fetchSeasons();
    }
  }

  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    const { router: { route: { match } } } = this.context;
    return (<SeasonsComponent match={ match } { ...this.props } />);
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
    fetchUsersWithTeams,
    fetchSeasons,
    fetchExternalStats,
    addSeason,
    addDivision,
    updateSeason,
    saveGameWeekStats,
  }
)(AdminPage);
