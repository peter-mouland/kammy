import React from 'react';
import { connect } from 'react-redux';

import Errors from '../../components/Errors/Errors';
import Interstitial from '../../components/Interstitial/Interstitial';
import Dashboard from '../../components/Dashboard/Dashboard';
import { fetchDashboardData, fetchSeasons } from '../../actions';

class DashboardPage extends React.Component {

  static needs = [fetchSeasons];

  componentDidMount() {
    if (this.props.seasons) return;
    this.props.fetchSeasons();
  }

  render() {
    const { errors = [], loading, seasons } = this.props;

    if (errors.length) {
      return <Errors errors={errors} />;
    } else if (loading || !seasons) {
      return <Interstitial />;
    }


    return (
      <Dashboard id="dashboard-page" />
    );
  }
}

function mapStateToProps(state) {
  return {
    seasons: state.seasons.data,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchDashboardData, fetchSeasons }
)(DashboardPage);
