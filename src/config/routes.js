import RulesPage from '@kammy-ui/rules-page';
import ProfilePage from '@kammy-ui/profile-page';
import Homepage from '@kammy-ui/home-page';
import ChangePassword from '@kammy-ui/change-password';
import LoginPage from '@kammy-ui/login';
import LogOut from '@kammy-ui/logout';

import DivisionsPage from '../app/components/DivisionsPage/DivisionsPage';
import AdminPage from '../app/components/AdminPage/AdminPage';
import MyTeam from '../app/components/MyTeamPage/MyTeamPage';
import TeamsPage from '../app/components/TeamsPage/TeamsPage';

const baseMetaData = {
  title: 'Fantasy Football',
  description: '',
  meta: {
    charSet: 'utf-8',
    name: {
      keywords: 'react,example',
    },
  },
};

const routesConfig = [
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

export default routesConfig;
