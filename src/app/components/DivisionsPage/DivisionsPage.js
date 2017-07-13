import React from 'react';
import { connect } from 'react-redux';

import Divisions from './DivisionsPage.component';
import { fetchDivisions } from './divisions.actions';

class DivisionsPage extends React.Component {
  static needs = [fetchDivisions];

  componentDidMount() {
    if (this.props.divisions) return;
    this.props.fetchDivisions();
  }

  render() {
    return (
      <Divisions { ...this.props } />
    );
  }
}

function mapStateToProps(state) {
  return {
    divisions: state.divisions.data,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchDivisions }
)(DivisionsPage);
