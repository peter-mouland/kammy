import mongoose from 'mongoose';

const User = mongoose.model('User');

export const validateUser = (ctx) => new Promise((resolve) => {
  const userFromToken = ctx.auth.validateToken();
  User.findById(userFromToken.sub, (err, user) => {
    ctx.context = { user };
    resolve(user);
  });
});

export default function authCheck() {
  return (ctx, next) => validateUser(ctx).then(next);
}
