import React from 'react';
import { connect } from 'react-redux';

import AdminPageComponent from './AdminPage.component';

import { fetchUsersWithTeams, updateTeam, addUser } from './admin-page.actions';


class AdminPage extends React.Component {
  static needs = [fetchUsersWithTeams];

  componentDidMount() {
    if (!this.props.players) {
      this.props.fetchUsersWithTeams();
    }
  }

  render() {
    return (<AdminPageComponent { ...this.props } />);
  }
}

function mapStateToProps(state) {
  return {
    users: state.users.data,
    userErrors: state.users.errors
  };
}

export default connect(
  mapStateToProps,
  {
    fetchUsersWithTeams,
    addUser,
    updateTeam,
  }
)(AdminPage);
