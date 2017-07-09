import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import MyTeamPage from './MyTeamPage.component';
import { fetchTeam, updateTeam } from './my-team.actions';

debug('kammy:myteam.container');

class MyTeam extends React.Component {
  static needs = [fetchTeam];

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
