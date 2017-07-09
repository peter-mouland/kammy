import React from 'react';
import { connect } from 'react-redux';

import Errors from '../../components/Errors/Errors';
import Interstitial from '../../components/Interstitial/Interstitial';
import { fetchDivisions } from '../../actions';

class DivisionsPage extends React.Component {
  static needs = [fetchDivisions];

  componentDidMount() {
    if (this.props.divisions) return;
    this.props.fetchDivisions();
  }

  render() {
    const { errors = [], loading, seasons } = this.props;

    if (errors.length) {
      return <Errors errors={errors} />;
    } else if (loading || !seasons) {
      return <Interstitial />;
    }


    return (
      <div id="divisions-page">hi</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    divisions: state.seasons.data,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchDivisions }
)(DivisionsPage);
