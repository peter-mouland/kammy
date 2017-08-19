import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchTeams } from '../admin-page.actions';
import ExportComponent from './Export.component';
import { fetchSeasons } from '../Seasons/seasons.actions';
import { fetchPlayers } from '../../Players/players.actions';

const log = debug('kammy:admin/Seasons');

class AdminPage extends React.Component {
  static needs = [fetchSeasons, fetchTeams, fetchPlayers];

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount() {
    if (!this.props.seasons) {
      this.props.fetchSeasons();
    }
    if (!this.props.teams) {
      this.props.fetchTeams();
    }
    if (!this.props.players) {
      this.props.fetchPlayers();
    }
  }

  render() {
    const { router: { route: { match } } } = this.context;
    return (<ExportComponent match={ match } { ...this.props } />);
  }
}

function mapStateToProps(state) {
  return {
    players: state.players.data,
    teams: state.teams.data,
    seasons: state.seasons.data,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchSeasons,
    fetchTeams,
    fetchPlayers
  }
)(AdminPage);
