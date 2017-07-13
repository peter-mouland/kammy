import React from 'react';
import bemHelper from 'react-bem-helper';

import Auth from '../../../authentication/auth-helper';
import { SubLink } from '../../../routes';
import joinPaths from '../../../utils/joinPath';
import AddUser from './AddUser';
import { ADD_USER } from './users.actions';

const bem = bemHelper({ name: 'user-list' });

export default class Users extends React.Component {
  addUser = (form) => {
    this.props.addUser(form);
  }

  render() {
    const { className, match, loading, seasons = [], users = [], userErrors = [] } = this.props;
    const addingUser = loading === ADD_USER;

    if (!Auth.isAdmin()) {
      return <p>You're not admin!</p>;
    }

    return (
      <section className={ className }>
        <div className="admin-options" data-test="admin-options--user">
          <div className="admin-option">
            <ul className="simple-list">
              { users.map((user) => user && (
                <li key={user._id}>
                  <SubLink { ...bem('text') } to={joinPaths(match.url, user._id)}>
                    { user.name || user.email }
                  </SubLink>
                </li>)
              )}
            </ul>
          </div>
          <div className="admin-option admin-option__btn">
            <AddUser
              add={(form) => this.addUser(form)}
              loading={ addingUser }
              errors={ userErrors }
              seasons={ seasons }
            />
          </div>
        </div>
      </section>
    );
  }
}
