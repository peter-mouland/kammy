import passport from 'koa-passport';
import { validateLoginForm, validateSignUpForm } from '@kammy/login';
import { validateUpdatePassword } from '@kammy/change-password';

import { validateSignUpResponse, validateLoginResponse } from './response-validation';
import localSignupStrategy from './passport/local-signup';
import localLoginStrategy from './passport/local-login';
import localUdpateStrategy from './passport/local-update';
import { validateUser } from './auth-check-middleware';

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (userId, done) => {
  await validateUser(userId)
    .then((user) => done(null, user))
    .catch(done);
});
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);
passport.use('local-update', localUdpateStrategy);

export const login = async (ctx, next) => {
  ctx.type = 'json';
  const validationResult = validateLoginForm(ctx.request.body);
  if (!validationResult.success) {
    ctx.status = 400;
    ctx.response.body = {
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    };
    return Promise.resolve(ctx);
  }
  return passport.authenticate('local-login', (err, token, userData) => {
    const res = validateLoginResponse(err, token, userData);
    ctx.status = res.status;
    ctx.response.body = res.body;
    ctx.auth.saveToken(token);
  })(ctx, next);
};

export const signUp = (ctx, next) => {
  ctx.type = 'json';
  const validationResult = validateSignUpForm(ctx.request.body);
  if (!validationResult.success) {
    ctx.status = 400;
    ctx.response.body = {
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    };
    return Promise.resolve(ctx);
  }
  return passport.authenticate('local-signup', (signUpError) => {
    const signUpResponse = validateSignUpResponse(signUpError);
    if (signUpResponse.status !== 200) {
      ctx.status = signUpResponse.status;
      ctx.response.body = signUpResponse.body;
      return Promise.resolve(ctx);
    }
    return passport.authenticate('local-login', (loginError, token, userData) => {
      const loginResponse = validateLoginResponse(loginError, token, userData);
      ctx.status = loginResponse.status;
      ctx.response.body = loginResponse.body;
      ctx.auth.saveToken(token);
    })(ctx, next);
  })(ctx, next);
};

export const updatePassword = (ctx, next) => {
  ctx.type = 'json';
  const validationResult = validateUpdatePassword(ctx.request.body);
  if (!validationResult.success) {
    ctx.status = 400;
    ctx.response.body = {
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    };
    return Promise.resolve(ctx);
  }
  return passport.authenticate('local-update', (signUpError) => {
    const signUpResponse = validateSignUpResponse(signUpError);
    if (signUpResponse.status !== 200) {
      ctx.status = signUpResponse.status;
      ctx.response.body = signUpResponse.body;
      return Promise.resolve(ctx);
    }
    return passport.authenticate('local-login', (loginError, token, userData) => {
      const loginResponse = validateLoginResponse(loginError, token, userData);
      ctx.status = loginResponse.status;
      ctx.response.body = loginResponse.body;
      ctx.auth.saveToken(token);
    })(ctx, next);
  })(ctx, next);
};

export const logout = (ctx, next) => {
  ctx.status = 200;
  ctx.type = 'json';
  ctx.auth.removeToken();
  ctx.response.body = { message: 'logged out' };
  next();
};

export const authenticate = (ctx, next) => {
  ctx.status = 200;
  ctx.type = 'json';
  ctx.auth.saveToken(ctx.auth.getToken());
  ctx.response.body = { message: 'authenticated' };
  next();
};

export const healthStatus = (ctx) => {
  ctx.type = 'json';
  ctx.status = 200;
  ctx.response.body = { status: 'healthy' };
};
