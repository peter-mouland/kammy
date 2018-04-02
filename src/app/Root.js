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

class Root extends React.Component {
  render() {
    const { appConfig, auth } = this.context;
    return (
      <Provider store={store}>
        <AppConfigProvider>
          <AuthProvider cookieToken={'kammy-token'}>
            <Router {...this.props} >
              {makeRoutes({ appConfig, auth })}
            </Router>
          </AuthProvider>
        </AppConfigProvider>
      </Provider>
    );
  }
}

Root.contextTypes = {
  appConfig: PropTypes.object,
  auth: PropTypes.object,
};

export default Root;
