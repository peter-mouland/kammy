import React from 'react';
import { connect } from 'react-redux';

import AdminPageComponent from './AdminPage.component';

import {
  fetchPlayers, fetchUsersWithTeams, updateTeam, addUser, updatePlayers, importPlayers
} from './admin-page.actions';


class AdminPage extends React.Component {
  static needs = [fetchUsersWithTeams];

  render() {
    return (<AdminPageComponent { ...this.props } />);
  }
}

function mapStateToProps(state) {
  return {
    users: state.users.data,
    userErrors: state.users.errors,
    players: state.players.data,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchUsersWithTeams,
    fetchPlayers,
    importPlayers,
    addUser,
    updatePlayers,
    updateTeam,
  }
)(AdminPage);
