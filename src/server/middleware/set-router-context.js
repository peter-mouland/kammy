import React from 'react';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import { Provider } from 'react-redux';
import cookie from 'react-cookie';
import matchPath from 'react-router-dom/matchPath';

import configureStore from '../../app/store/configure-store';
import { makeRoutes } from '../../app/routes';
import routesConfig from '../../config/routes';
import AppConfigProvider from '../../config/Provider.jsx';

function getMatch(routesArray, url) {
  return routesArray
    .find((route) => matchPath(url, { path: route.path, exact: route.exact, strict: false }));
}

async function getRouteData(routesArray, url, dispatch) {
  const needs = [];
  routesArray
    .filter((route) => route.component.needs)
    .forEach((route) => {
      const match = matchPath(url, { path: route.path, exact: route.exact, strict: false });
      if (match) {
        route.component.needs.forEach((need) => {
          const result = need(Object.keys(match.params).length > 0 ? match.params : undefined);
          needs.push(dispatch(result));
        });
      }
    });
  await Promise.all(needs);
}

const Markup = ({ req, store, context }) => (
  <Provider store={store}>
    <AppConfigProvider>
      <StaticRouter location={req.url} context={ context } >
        {makeRoutes({ appConfig: { routes: routesConfig } })}
      </StaticRouter>
    </AppConfigProvider>
  </Provider>
);

function setRouterContext() {
  return async (ctx, next) => {
    const routerContext = {};
    const store = configureStore();
    cookie.plugToRequest(ctx.request, ctx.response); // essential for universal cookies
    await getRouteData(routesConfig, ctx.request.url, store.dispatch);
    const markup = renderToString(Markup({ req: ctx.request, store, context: routerContext }));
    const match = getMatch(routesConfig, ctx.request.url);
    if (routerContext.url) {
      ctx.status = 301;
      ctx.redirect(routerContext.location.pathname + routerContext.location.search);
    } else {
      ctx.status = match ? 200 : 404;
      ctx.initialState = store.getState();
      ctx.markup = markup;
    }
    await next();
  };
}

export default setRouterContext;
