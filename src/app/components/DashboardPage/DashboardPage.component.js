import React from 'react';

import Errors from '../Errors/Errors';
import Interstitial from '../Interstitial/Interstitial';

export default class DashboardPage extends React.Component {
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
      <div id="dashboard-page" >
        <h1>Dashboard</h1>
        <p>hi</p>
      </div>
    );
  }
}
