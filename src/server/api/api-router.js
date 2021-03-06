import bodyparser from 'koa-bodyparser';
import Router from 'koa-router';
import { graphql } from 'graphql';
import debug from 'debug';
import jwt from 'koa-jwt';

import config from '../../config/db';
import * as queries from './graphql.queries';
import schema from './graphql.schema';
import root from './graphql.root';
import handleError from '../middleware/handle-error';
import authCheck from '../authentication/auth-check-middleware';

const log = debug('kammy:graphql-router');
const router = Router({ prefix: '/graphql/v1' });

router.use(handleError());
router.use(bodyparser({
  enableTypes: ['text'],
  extendTypes: {
    text: ['application/graphql'] // will parse application/x-javascript type body as a JSON string
  }
}));

router.get('/', (ctx) => {
  ctx.type = 'json';
  ctx.status = 200;
  ctx.response.body = { status: 'healthy' };
});

router.use(jwt({ secret: config.jwtSecret, passthrough: true }));
router.use(authCheck());

router.post('/', async (ctx) => {
  const { request, context } = ctx;
  try {
    const requestString = JSON.parse(request.body);
    await graphql(schema, queries[requestString.query], root, context, requestString.variables)
      .then((result) => {
        ctx.type = 'json';
        ctx.body = result;
      });
  } catch (e) {
    ctx.status = 500;
    ctx.response.body = { error: e };
  }
});

export default router;
