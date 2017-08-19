import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ExportComponent from './Export.component';
import { fetchSeasons, fetchUsersWithTeams } from '../Seasons/seasons.actions';

const log = debug('kammy:admin/Seasons');

class AdminPage extends React.Component {
  static needs = [fetchSeasons];

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount() {
    if (!this.props.seasons) {
      this.props.fetchSeasons();
    }
  }

  render() {
    const { router: { route: { match } } } = this.context;
    return (<ExportComponent match={ match } { ...this.props } />);
  }
}

function mapStateToProps(state) {
  return {
    seasonUsers: state.seasons.seasonUsers,
    seasons: state.seasons.data,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchUsersWithTeams,
    fetchSeasons,
  }
)(AdminPage);
