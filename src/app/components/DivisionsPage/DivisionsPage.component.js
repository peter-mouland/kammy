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
    const divisionsSet = new Set();
    if (errors.length) {
      return <Errors errors={errors} />;
    } else if (loading || !divisions) {
      return <Interstitial />;
    }

    const divisionsArr = Array.from(divisionsSet);
    return (
      <div id="divisions-page">
        {divisionsArr.map((division) => <p>{division.name}</p>)}
      </div>
    );
  }
}
