import router from 'koa-router';
import debug from 'debug';

const users = require('./scripts/users');
const teams = require('./scripts/teams');
const players = require('./scripts/players');
const seasons = require('./scripts/seasons');
const seasonFixture = require('./fixtures/seasons.json');
const playersFixture = require('./fixtures/players.json');

const apiRouter = router({ prefix: '/api' });
const log = debug('kammy:test-db-routes');

const envCheck = (reason = '') => new Promise((resolve, reject) => {
  if (process.env.NODE_ENV === 'production') {
    reject(`Cant ${reason} as you are on production`);
  } else {
    resolve();
  }
});

apiRouter.get('/nuke/users/:email', async (ctx) => {
  ctx.type = 'json';
  ctx.body = { };
  await envCheck('nuke users')
    .then(() => users.generateUser({ email: ctx.params.email }))
    .then((nuked) => {
      ctx.body = Object.assign(ctx.body, { nuked });
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      ctx.body = { err };
    });
});

apiRouter.get('/nuke/seasons/:season', async (ctx) => {
  ctx.type = 'json';
  ctx.body = { };
  await envCheck('nuke seasons')
    .then(() => seasons.nuke({ name: ctx.params.season }))
    .then((nuked) => {
      ctx.body = Object.assign(ctx.body, { nuked });
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      ctx.body = { err };
    });
});

apiRouter.get('/puke/new-season-journey/:email/:password', async (ctx) => {
  ctx.type = 'json';
  ctx.body = { };
  await envCheck('puke new-season-journey')
    .then(() => users.generateUser({
      email: ctx.params.email.trim(),
      password: ctx.params.password.trim(),
      isAdmin: true,
      mustChangePassword: false
    }))
    .then((puked) => {
      ctx.body = Object.assign(ctx.body, { puked });
      ctx.status = 200;
    }).catch((err) => {
      ctx.status = 500;
      ctx.body = { err };
    });
});

apiRouter.get('/puke/new-game-week-journey/:email/:password', async (ctx) => {
  ctx.type = 'json';
  ctx.body = { };
  const insertUser = {
    email: ctx.params.email.trim(),
    password: ctx.params.password.trim(),
    isAdmin: true,
    mustChangePassword: false
  };
  const insertSeason = seasonFixture.seasons[0];
  const insertPlayers = playersFixture.players;
  const createTeam = (user, season, division) => ({
    user: { _id: user._id, name: user.name || user.email },
    season: { _id: season._id, name: season.name },
    division: { _id: division._id, name: division.name },
  });
  await envCheck('puke new-game-week-journey')
    .then(async () => {
      const insertedUser = await users.puke(insertUser);
      const insertedSeason = await seasons.puke(insertSeason);
      const insertedPlayers = await players.puke(insertPlayers);
      const insertedTeam = await teams.puke(createTeam(insertedUser, insertedSeason, insertedSeason.divisions[0]));
      return { insertedUser, insertedSeason, insertedTeam, insertedPlayers }
    })
    .then((inserted) => {
      ctx.body = JSON.stringify(inserted);
      ctx.status = 200;
    }).catch((err) => {
      log({ err })
      ctx.status = 500;
      ctx.body = JSON.stringify({ err });
    });
});

export default apiRouter;
