import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import StaticRouter from 'react-router-dom/StaticRouter';
import { AuthProvider } from '@kammy/auth-provider';

import { makeRoutes } from './routes';
import configureStore from './store/configure-store';
import { isBrowser } from './utils';
import AppConfigProvider from '../config/Provider.jsx';

// exported to be used in tests
export const Router = isBrowser ? BrowserRouter : StaticRouter;
const store = configureStore(window.__INITIAL_STATE__); // eslint-disable-line

const MakeRoutesWithContext = (props, { appConfig, auth }) => (
  makeRoutes({ appConfig, auth })
);

MakeRoutesWithContext.contextTypes = {
  appConfig: PropTypes.object,
  auth: PropTypes.object,
};

const Root = (props) => (
  <Provider store={store}>
    <AppConfigProvider>
      <AuthProvider cookieToken={'kammy-token'}>
        <Router {...props} >
          <MakeRoutesWithContext />
        </Router>
      </AuthProvider>
    </AppConfigProvider>
  </Provider>
);

export default Root;
