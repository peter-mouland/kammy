import React from 'react';
import Route from 'react-router-dom/Route';

import AdminList from './AdminList/AdminList';
import Auth from '../../authentication/auth-helper';

import Seasons from './Seasons/Seasons';
import Users from './Users/Users';
import Players from './Players/Players';
import Export from './Export/Export';

import './admin-page.scss';

const ADMIN_ROUTES = [
  { name: 'Seasons', path: 'seasons', Component: Seasons },
  { name: 'Users', path: 'users', Component: Users },
  { name: 'Players', path: 'players', Component: Players },
  { name: 'Export Data', path: 'export', Component: Export }
];

export default () => {
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
          list={ ADMIN_ROUTES }
        />
        {ADMIN_ROUTES.map((route) => (
          <Route
            key={`/admin/${route.path}`}
            path={`/admin/${route.path}`}
            render={({ match }) => (
              <route.Component className={`admin__panel admin__panel--${route.path}`} match={ match } />
            )}
          />
        ))}

        <h3>tech-debt:</h3>
        <ul>
          <li>add <em>more</em> e2e tests</li>
          <li>make season/division names unique</li>
          <li>refactor links to use names rather than id</li>
          <li>refactor arrays to objects to make easier to manipulate</li>
          <li>refactor admin to admin/components</li>
        </ul>
      </div>
    </div>
  );
};
