import React from 'react';
import PropTypes from 'prop-types';

import Interstitial from '../../Interstitial/Interstitial';
import Errors from '../../Errors/Errors';
import Toggle from '../../Toggle/Toggle';

class AddUser extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  }

  state = {
    divisions: this.props.seasons[0] ? this.props.seasons[0].divisions : []
  }

  inputs = {};

  toggleAdmin = (e) => {
    this.inputs.isAdmin = e.target.checked;
  }

  add = (e) => {
    e.preventDefault();
    this.props.add({
      name: this.inputs.name.value,
      email: this.inputs.email.value,
      isAdmin: this.inputs.isAdmin,
      divisionId: this.inputs.division.value,
      seasonId: this.inputs.season.value,
    });
  };

  getDivisions = () => {
    const seasonId = this.inputs.season.value;
    const divisions = this.props.seasons.find((season) => season._id === seasonId).divisions;
    this.setState({ divisions });
  }

  render() {
    const { loading, errors, seasons = [] } = this.props;
    const { divisions } = this.state;
    return (
      <div className="admin-option">
        <h2>Add User</h2>
        { errors.length > 0 ? <Errors errors={ errors } small /> : null }
        { loading && errors.length === 0
          ? <Interstitial>Saving</Interstitial>
          : <form method="post" onSubmit={ this.add }>
            <small>
              <em>All new users are added with the password <code>password123</code></em>
            </small>
            <div>
              <label htmlFor="user-name" required>Name:</label>
              <input
                id="user-name"
                name="user-name"
                type="text"
                autoComplete="off"
                ref={(input) => {
                  this.inputs.name = input;
                }}
              />
            </div>
            <div>
              <label htmlFor="user-email" required>Email:</label>
              <input
                id="user-email"
                name="user-email"
                type="email"
                autoComplete="off"
                ref={(input) => {
                  this.inputs.email = input;
                }}
              />
            </div>
            <div>
              <Toggle
                checked={ false }
                id={'user-admin--new'}
                className="admin-option"
                ref={() => {
                  this.inputs.isAdmin = false;
                }}
                onChange={ this.toggleAdmin }
              >
                Is Admin?
              </Toggle>
            </div>
            <p>Assign team to:</p>
            <div>
              <label htmlFor="user-season" required>Season:</label>
              <select
                id="user-season"
                name="user-season"
                ref={(input) => {
                  this.inputs.season = input;
                }}
                onChange={ this.getDivisions }
              >
                {seasons.map((season) =>
                  <option key={season._id} value={season._id}>{season.name}</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="user-division" required>Division:</label>
              <select
                id="user-division"
                name="user-division"
                ref={(input) => {
                  this.inputs.division = input;
                }}
              >
                {divisions.map((division) =>
                  <option key={division._id} value={division._id}>{division.name}</option>
                )}
              </select>
            </div>
            <input className="admin-btn" type="submit" value="Add New User"/>
          </form>
        }
      </div>
    );
  }
}

export default AddUser;
