import React from 'react';

import Errors from '../Errors/Errors';
import Interstitial from '../Interstitial/Interstitial';

export default class DivisionsPage extends React.Component {
  componentDidMount() {
    if (this.props.divisions) return;
    this.props.fetchDivisions();
  }

  render() {
    const { errors = [], loading, divisions } = this.props;

    if (errors.length) {
      return <Errors errors={errors} />;
    } else if (loading || !divisions) {
      return <Interstitial />;
    }

    return (
      <div id="divisions-page">hi</div>
    );
  }
}
