/* eslint-disable no-confusing-arrow */
import React from 'react';
import bemHelper from 'react-bem-helper';
import Route from 'react-router-dom/Route';

import { SubLink } from '../../../routes';
import joinPaths from '../../../utils/joinPath';
import AddUser from './AddUser';
import EditUser from './EditUser';
import { ADD_USER } from './users.actions';

const bem = bemHelper({ name: 'user-list' });

export default class Users extends React.Component {
  addUser = (form) => {
    this.props.addUser(form);
  }

  updateUser = (form) => {
    this.props.updateUser(form);
  }

  render() {
    const {
      className, match, loading, seasons = [], users = [], userErrors = [], updatingUser
    } = this.props;
    const addingUser = loading === ADD_USER;

    return (
      <section className={ className }>
        <div className="admin-options" data-test="admin-options--user">
          <div className="admin-option">
            <ul className="simple-list">
              { users
                .sort((userA, userB) => userA.name < userB.name ? -1 : 1)
                .map((user) => user && (
                  <li key={user._id}>
                    <SubLink { ...bem('text') } to={joinPaths(match.url, user._id)}>
                      { user.name || user.email }
                    </SubLink>
                  </li>))
              }
            </ul>
          </div>
          <div className="admin-option admin-option__btn">

            <Route
              path={'/admin/users/'}
              render={({ match: userMatch }) => (!userMatch.isExact ? null : (
                <AddUser
                  add={(form) => this.addUser(form)}
                  loading={ addingUser }
                  errors={ userErrors }
                  seasons={ seasons }
                  key={ userMatch.params.userId }
                />
              ))}
            />
            <Route
              path={'/admin/users/:userId'}
              render={({ match: userMatch }) => (
                <div className="admin-option" >
                  <EditUser
                    user={ users.find((user) => user._id === userMatch.params.userId)}
                    update={(form) => this.updateUser(form)}
                    saving={ updatingUser }
                    errors={ userErrors }
                    key={ userMatch.params.userId }
                  />
                  <SubLink { ...bem('button', null, 'button') } to={joinPaths('/admin/users')}>
                    Cancel
                  </SubLink>
                </div>
              )}
            />
          </div>
        </div>
      </section>
    );
  }
}
