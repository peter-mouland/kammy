import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debug from 'debug';

import MyTeamPage from './MyTeamPage.component';
import { fetchTeam, updateTeam } from './my-team.actions';

debug('kammy:myteam.container');

class MyTeam extends React.Component {
  static contextTypes = {
    auth: PropTypes.object
  }

  componentDidMount() {
    const { auth } = this.context;
    if (!this.props.team) {
      this.props.fetchTeam({ teamId: auth.user().defaultTeamId });
    }
  }

  render() {
    return (
      <MyTeamPage { ...this.props } />
    );
  }
}

function mapStateToProps(state) {
  return {
    team: state.myTeam.data,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchTeam, updateTeam }
)(MyTeam);
