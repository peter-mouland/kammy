import React from 'react';
import { connect } from 'react-redux';

import UsersComponent from './Users.component';

import { fetchUsersWithTeams, updateTeam, addUser } from './users.actions';
import { fetchSeasons } from '../Seasons/seasons.actions';

class Users extends React.Component {
  static needs = [fetchUsersWithTeams, fetchSeasons];

  render() {
    return (<UsersComponent { ...this.props } />);
  }
}

function mapStateToProps(state) {
  return {
    users: state.users.data,
    userErrors: state.users.errors,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchSeasons,
    fetchUsersWithTeams,
    addUser,
    updateTeam,
  }
)(Users);
