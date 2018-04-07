import Cookies from 'universal-cookie';
import { Auth } from '@kammy/auth-provider';
import { cookieToken } from '../../config/config';

export default function initAuthMiddleware() {
  return (ctx, next) => {
    ctx.request.universalCookies = new Cookies(
      ctx.request.headers.cookie || '',
      {
        onSet(name, value, options) {
          ctx.cookies.set(name, value, options);
        },
        onRemove(name) {
          ctx.cookies.set(name, null);
        }
      }
    );

    ctx.auth = new Auth({ cookieToken, ctx });
    return next();
  };
}
