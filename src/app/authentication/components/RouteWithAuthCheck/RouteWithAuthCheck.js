import React from 'react';
import Redirect from 'react-router-dom/Redirect';
import Route from 'react-router-dom/Route';
import debug from 'debug';
import DocumentMeta from 'react-document-meta';

import Auth from '../../auth-helper';

const log = debug('kammy:RouteWithAuthCheck');

const RouteWithAuthCheck = ({
  component: Component, requiresAuthentication, meta, ...props
}) => {
  const redirect = requiresAuthentication && !Auth.validateToken();
  const redirectTo = Auth.user().mustChangePassword
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

export default RouteWithAuthCheck;
