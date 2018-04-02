import mongoose from 'mongoose';

import { Auth } from '@kammy/auth-provider';
import { cookieToken } from '../../config/config';

const User = mongoose.model('User');
const auth = new Auth({ cookieToken });

export const validateUser = (ctx) => new Promise((resolve) => {
  const userFromToken = auth.validateToken(ctx);
  User.findById(userFromToken.sub, (err, user) => {
    ctx.context = { user };
    resolve(user);
  });
});

export default function authCheck() {
  return (ctx, next) => Promise.resolve(ctx)
    .then(validateUser)
    .then(next);
}
