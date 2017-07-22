import React from 'react';
import Route from 'react-router-dom/Route';

import AdminList from './AdminList/AdminList';
import Auth from '../../authentication/auth-helper';

import Seasons from './Seasons/Seasons';
import Users from './Users/Users';
import Players from './Players/Players';

import './admin-page.scss';

export default class AdminPage extends React.Component {
  render() {
    if (!Auth.isAdmin()) {
      return <p>You're not admin!</p>;
    }

    return (
      <div className="admin" id="admin-page">
        <h1>Admin</h1>
        <div className="admin__panels">
          <div className="bg" />

          <AdminList
            type="main-nav"
            list={ [
              { name: 'Seasons', path: 'seasons' },
              { name: 'Users', path: 'users' },
              { name: 'Players', path: 'players' }
            ] }
          />

          <Route
            path={'/admin/seasons'}
            render={({ match }) => (
              <Seasons className="admin__panel admin__panel--seasons" match={ match } />
            )}
          />

          <Route
            path={'/admin/users'}
            render={({ match }) => (
              <Users className="admin__panel admin__panel--users" match={ match } />
            )}
          />

          <Route
            path={'/admin/players'}
            render={({ match }) => (
              <Players className="admin__panel admin__panel--players" match={ match } />
            )}
          />

          <h3>tech-debt:</h3>
          <ul>
            <li>fix saving players - no errors shown</li>
            <li>add <em>more</em> e2e tests</li>
            <li>make season/division names unique</li>
            <li>refactor links to use names rather than id</li>
            <li>refactor arrays to objects to make easier to manipulate</li>
            <li>refactor admin to admin/components</li>
          </ul>
        </div>
      </div>
    );
  }
}
