import React from 'react';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import Switch from 'react-router-dom/Switch';
import bemHelper from 'react-bem-helper';
import NotFound from '@kammy-ui/not-found';
import ClassicLayout from '@kammy-ui/classic-layout';
import NavBar from '@kammy-ui/nav-bar';

import PrivateRoute from '@kammy-ui/private-route';

export const SubLink = ({
  className, to, children, ...props
}) => {
  const bem = bemHelper({ name: 'link' });
  return (
    <Route
      path={ to } children={({ match }) => (
        <Link to={ to } { ...props } { ...bem(null, { active: match }, className) }>
          { children }
        </Link>
      )} />
  );
};

export function makeRoutes({ appConfig, auth }) {
  const authenticated = !!auth.validateToken();
  const user = auth.user();

  return (
    <ClassicLayout
      NavBar={(
        <NavBar isUserAuthenticated={authenticated} isAdmin={user.isAdmin} name={user.name }/>
      )}
    >
      <Switch>
        {appConfig.routes.map((route) => (
          route.requiresAuthentication
            ? <PrivateRoute {...route} key={ route.name } />
            : <Route {...route} key={ route.name } />
        ))}
        <Route title={'Page Not Found - Fantasy Football'} component={ NotFound }/>
      </Switch>
    </ClassicLayout>
  );
}
