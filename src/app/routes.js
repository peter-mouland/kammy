import React from 'react';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import Switch from 'react-router-dom/Switch';
import bemHelper from 'react-bem-helper';
import debug from 'debug';

import MainLayout from './Layouts/MainLayout';
import Homepage from './containers/Homepage/Homepage';
import DashboardPage from './containers/DashboardPage/DashboardPage';
import AdminPage from './containers/AdminPage/AdminPage';
import MyTeam from './containers/MyTeam/MyTeam';
import PlayerStats from './containers/PlayerStats/PlayerStats';
import NotFound from './containers/NotFound/NotFound';

import LoginPage from './authentication/containers/LoginPage/LoginPage';
import LogOut from './authentication/components/LogOut/LogOut';
import RouteWithAuthCheck from './authentication/components/RouteWithAuthCheck/RouteWithAuthCheck';

debug('ff:routes');

const baseMetaData = {
  title: 'Fantasy Football',
  description: '',
  meta: {
    charset: 'utf-8',
    name: {
      keywords: 'react,example'
    }
  }
};

export function getRoutesConfig() {
  return [
    {
      name: 'homepage',
      exact: true,
      path: '/',
      meta: {
        ...baseMetaData,
        title: 'Fantasy Football'
      },
      label: 'Homepage',
      component: Homepage
    },
    {
      name: 'admin',
      path: '/admin/',
      meta: {
        ...baseMetaData,
        title: 'Admin'
      },
      label: 'Admin',
      requiresAuthentication: true,
      component: AdminPage,
    },
    {
      name: 'myTeam',
      path: '/MyTeam/',
      label: 'My Team',
      meta: {
        ...baseMetaData,
        title: 'My Team',
      },
      component: MyTeam,
      requiresAuthentication: true,
    },
    {
      name: 'playerStats',
      path: '/player-stats/',
      label: 'Player Stats',
      meta: {
        ...baseMetaData,
        title: 'Player Stats',
      },
      component: PlayerStats
    },
    {
      name: 'logout',
      path: '/logout/',
      label: 'Logout',
      meta: {
        ...baseMetaData,
        title: 'Logout',
      },
      component: LogOut
    },
    {
      name: 'profile',
      path: '/profile/',
      label: 'Profile',
      meta: {
        ...baseMetaData,
        title: 'profile',
      },
      requiresAuthentication: true,
      component: <p>Hey profile!</p>
    },
    {
      name: 'login',
      path: '/login/',
      label: 'Login',
      meta: {
        ...baseMetaData,
        title: 'Login',
      },
      component: LoginPage
    },
    {
      name: 'dashboard',
      path: '/dashboard/',
      requiresAuthentication: true,
      label: 'Dashboard',
      meta: {
        ...baseMetaData,
        title: 'Dashboard',
      },
      component: DashboardPage
    }
  ];
}

// test this. no failing test if getRoutesConfig instead of getRoutesConfig()
export const findRoute = (to) => getRoutesConfig().find((rt) => rt.name === to);

// test this active link and route matching
export const NamedLink = ({ className, to, children, ...props }) => {
  const bem = bemHelper({ name: 'link' });
  const route = findRoute(to);
  if (!route) throw new Error(`Route to '${to}' not found`);
  return (
    <Route path={ route.path } children={({ match }) => (
      <Link to={ route.path } { ...props } { ...bem(null, { active: match }, className) }>
        { children || route.label }
      </Link>
    )} />
  );
};

export const SubLink = ({ className, to, children, ...props }) => {
  const bem = bemHelper({ name: 'link' });
  return (
    <Route path={ to } children={({ match }) => (
      <Link to={ to } { ...props } { ...bem(null, { active: match }, className) }>
        { children }
      </Link>
    )} />
  );
};

export function makeRoutes() {
  return (
    <MainLayout>
      <Switch>
        {getRoutesConfig().map((route) => <RouteWithAuthCheck {...route} key={ route.name } />)}
        <Route title={'Page Not Found - Fantasy Football'} component={ NotFound }/>
      </Switch>
    </MainLayout>
  );
}
