import React from 'react';
import Interstitial from '@kammy-ui/interstitial';

import Errors from '@kammy-ui/errors';

export default class DashboardPage extends React.Component {
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
