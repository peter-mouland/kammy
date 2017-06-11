import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';

import { SubLink, joinPaths } from '../../../app/routes';

import './adminOptions.scss';

const bem = bemHelper({ name: 'user-list' });

class UserAdminOptions extends React.Component {

  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    const { children, users, ...props } = this.props;
    const { router: { route: { match } } } = this.context;
    return (
      <div className="admin-options"
           { ...props }
           data-test="admin-options--user"
      >
        <div className="admin-option">
          <ul className="simple-list">
            { users.map((user) => (
                <li key={user._id}>
                  <SubLink { ...bem('text') } to={joinPaths(match.url, user._id)}>
                    { user.name || user.email }
                  </SubLink>
                </li>)
            )}
          </ul>
        </div>
        <div className="admin-option admin-option__btn">
          { children }
        </div>
      </div>
    );
  }
}

export default UserAdminOptions;
