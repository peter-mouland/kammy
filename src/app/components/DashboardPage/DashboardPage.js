import React from 'react';
import { connect } from 'react-redux';

import Dashboard from './DashboardPage.component';
import { fetchDashboardData } from './dashboard.actions';

class DashboardPage extends React.Component {
  static needs = [fetchDashboardData];

  componentDidMount() {
    if (this.props.seasons) return;
    this.props.fetchSeasons();
  }

  render() {
    return (
      <Dashboard { ...this.props } />
    );
  }
}

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard.data,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchDashboardData }
)(DashboardPage);
