import React from 'react';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import Switch from 'react-router-dom/Switch';
import bemHelper from 'react-bem-helper';
import debug from 'debug';
import RulesPage from '@kammy/rules-page';
import NotFound from '@kammy/not-found';
import ProfilePage from '@kammy/profile-page';
import Homepage from '@kammy/home-page';
import ClassicLayout from '@kammy/classic-layout';
import NavBar from '@kammy/nav-bar';

import DivisionsPage from './components/DivisionsPage/DivisionsPage';
import AdminPage from './components/AdminPage/AdminPage';
import MyTeam from './components/MyTeamPage/MyTeamPage';
import TeamsPage from './components/TeamsPage/TeamsPage';

import ChangePassword from './authentication/components/ChangePasswordPage/ChangePasswordPage';
import LoginPage from './authentication/components/LoginPage/LoginPage';
import LogOut from './authentication/components/LogOut/LogOut';
import RouteWithAuthCheck from './authentication/components/RouteWithAuthCheck/RouteWithAuthCheck';
import Auth from './authentication/auth-helper';

debug('kammy:routes');

const baseMetaData = {
  title: 'Fantasy Football',
  description: '',
  meta: {
    charSet: 'utf-8',
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
      name: 'teams',
      path: '/teams/',
      label: 'Teams',
      meta: {
        ...baseMetaData,
        title: 'Teams',
      },
      component: TeamsPage,
    },
    {
      name: 'myTeam',
      path: '/my-team/',
      label: 'My Team',
      meta: {
        ...baseMetaData,
        title: 'My Team',
      },
      component: MyTeam,
      requiresAuthentication: true,
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
      component: ProfilePage
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
      name: 'rules',
      path: '/rules/',
      label: 'Rules',
      meta: {
        ...baseMetaData,
        title: 'Rules',
      },
      component: RulesPage
    },
    {
      name: 'divisions',
      path: '/divisions/',
      label: 'Divisions',
      meta: {
        ...baseMetaData,
        title: 'Divisions',
      },
      component: DivisionsPage
    },
    {
      name: 'change-password',
      path: '/change-password/',
      requiresAuthentication: true,
      label: 'Change Password',
      meta: {
        ...baseMetaData,
        title: 'Change Password',
      },
      component: ChangePassword
    }
  ];
}

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

export function makeRoutes() {
  return (
    <ClassicLayout
      NavBar={(
        <NavBar isUserAuthenticated={Auth.validateToken()} isAdmin={true} name={Auth.user().name }/>
      )}
    >
      <Switch>
        {getRoutesConfig().map((route) => <RouteWithAuthCheck {...route} key={ route.name } />)}
        <Route title={'Page Not Found - Fantasy Football'} component={ NotFound }/>
      </Switch>
    </ClassicLayout>
  );
}
