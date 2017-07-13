import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import MyTeamPage from './MyTeamPage.component';
import { fetchTeam, updateTeam } from './my-team.actions';
import Auth from '../../authentication/auth-helper';

debug('kammy:myteam.container');

class MyTeam extends React.Component {
  static needs = [fetchTeam];

  componentDidMount() {
    if (!this.props.team) {
      this.props.fetchTeam({ teamId: Auth.user().defaultTeamId });
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
