import Chance from 'chance';
import supertest from 'supertest';
import cookie from 'react-cookie';
import Koa from 'koa';
import jwt from 'jsonwebtoken';

import apiRouter from '../../../src/server/api/api-router';
import users from '../../test-servers/scripts/users';
import config from '../../../src/config/db.js'; // must be app secret not test secret!

const chance = new Chance();
const apiRoute = '/graphql/v1';
let fakeState;
let fakeKey;
let fakeValue;
let fakeToken;

// Add fixture data -> Needed to get a valid token that points to a valid user in the test db
const insertUsers = (fakeUser) => {
  return users.puke(fakeUser).then((insertedUser) => {
    const payload = { sub: insertedUser };
    return jwt.sign(payload, config.jwtSecret);
  });
};
// end Add fixture data

const server = new Koa();
server.use(apiRouter.routes());

describe('apiRouter', () => {

  beforeEach(()=>{
    fakeKey = chance.word();
    fakeValue = chance.word();
    fakeState = { [fakeKey]: fakeValue };
  });

  afterEach(() => {
    cookie.remove('token');
  })

  it('returns a 404 with unrecognised route', (done) => {
    supertest(server.callback())
      .get(`${apiRoute}/route-that-doesnt-exist/`)
      .expect(404, /Not found/i)
      .end(done);
  });

  it('returns a 200 with a recognised route', (done) => {
    supertest(server.callback())
      .get(apiRoute)
      .expect(200, /healthy/i)
      .end(done);
  });

  it.skip('returns a 401 when accessing a route that needs authorisation', (done) => {
    supertest(server.callback())
      .post(apiRoute)
      .type('application/graphql')
      .send(`{ "query":"${chance.word()}" }`)
      .expect(401, /Unauthorized/i)
      .end(done);
  });

  context('with a valid token', () => {

    it('returns a 401 when sending the token with an authorisation header without a cookie', (done) => {
      const fakeUser = { email: chance.email() };
      insertUsers(fakeUser).then(token => {
        supertest(server.callback())
          .post(apiRoute)
          .set('Authorization', 'Bearer ' + token)
          .type('application/graphql')
          .send(`{ "query":"${chance.word()}" }`)
          .expect(401)
          .end(() => {
            users.nuke(fakeUser).then(done);
          });
      })
    });

    it('returns a 401 when sending the token as a cookie without the auth header', (done) => {
      const fakeUser = { email: chance.email() };
      insertUsers(fakeUser).then(token => {
        cookie.save('token', token, { path: '/'});
        supertest(server.callback())
          .post(apiRoute)
          .type('application/graphql')
          .send(`{ "query":"${chance.word()}" }`)
          .expect(401)
          .end(() => {
            users.nuke(fakeUser).then(done);
          });
      });
    });

    it.skip('returns a 200 when sending the token with an authorisation header', (done) => {
      const fakeUser = { email: chance.email() };
      insertUsers(fakeUser)
        .then(token => {
          cookie.save('token', token, { path: '/'});
          supertest(server.callback())
            .post(apiRoute)
            .set('Authorization', 'Bearer ' + token)
            .type('application/graphql')
            .send(`{ "query":"${chance.word()}" }`)
            .expect(200, /You're authorized to see this secret message./i)
            .end(() => {
              users.nuke(fakeUser).then(done);
            });
        })
    });
  });

  context('with an invalid token', () => {
    beforeEach(()=>{
      fakeToken = chance.word();
    });

    it.skip('returns a 401 when sending the token a an authorisation header', (done) => {
      cookie.save('token', fakeToken, { path: '/'});
      supertest(server.callback())
        .post(apiRoute)
        .set('Authorization', 'Bearer ' + fakeToken)
        .type('application/graphql')
        .send(`{ "query":"${chance.word()}" }`)
        .expect(401)
        .end(done);
    });
  });

});
