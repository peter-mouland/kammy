import React from 'react';
import PropTypes from 'prop-types';

import Interstitial from '../../Interstitial/Interstitial';
import Errors from '../../Errors/Errors';

export default class EditUser extends React.Component {
  static propTypes = {
    saving: PropTypes.bool,
  }

  inputs = {};

  update = (e) => {
    e.preventDefault();
    this.props.update({
      _id: this.inputs.id.value,
      name: this.inputs.name.value,
      email: this.inputs.email.value,
    });
  };

  render() {
    const { saving, errors, user } = this.props;
    return (
      <div className="admin-option">
        <h2>Edit User</h2>
        { errors.length > 0 ? <Errors errors={ errors } small /> : null }
        { saving && errors.length === 0
          ? <Interstitial>Saving</Interstitial>
          : <form method="post" onSubmit={ this.update }>
            <div>
              <input
                id="user-id"
                name="user-id"
                type="hidden"
                autoComplete="off"
                defaultValue={ user._id }
                ref={(input) => {
                  this.inputs.id = input;
                }}
              />
              <label htmlFor="user-name" required>Name:</label>
              <input
                id="user-name"
                name="user-name"
                type="text"
                autoComplete="off"
                defaultValue={ user.name }
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
                defaultValue={ user.email }
                ref={(input) => {
                  this.inputs.email = input;
                }}
              />
            </div>
            <input className="admin-btn" type="submit" value="Update User"/>
          </form>
        }
      </div>
    );
  }
}
