import React from 'react';
import PropTypes from 'prop-types';
import Redirect from 'react-router-dom/Redirect';
import Route from 'react-router-dom/Route';
import debug from 'debug';
import DocumentMeta from 'react-document-meta';

const log = debug('kammy:RouteWithAuthCheck');

const RouteWithAuthCheck = ({
  component: Component, requiresAuthentication, meta, ...props
}, { auth }) => {
  const redirect = requiresAuthentication && !auth.validateToken();
  const redirectTo = auth.user().mustChangePassword
    ? '/change-password/'
    : '/login';
  log({ redirectTo });
  return (
    <Route
      {...props} render={(matchProps) => (
        <span>
          <DocumentMeta { ...meta }/>
          { redirect ?
            (<Redirect
              to={{
                pathname: redirectTo,
                state: { from: matchProps.location }
              }}/>
            ) : <Component {...matchProps}/>
          }
        </span>
      )}/>
  );
};

RouteWithAuthCheck.contextTypes = {
  auth: PropTypes.object,
};

export default RouteWithAuthCheck;
