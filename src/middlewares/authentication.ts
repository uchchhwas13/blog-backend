import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, UserTokenPayload } from '../services/authentication';

export function checkAuthenticationCookie(cookieName: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const tokenCookieValue = req.cookies?.[cookieName];
    console.log('Token cookie value:', tokenCookieValue);
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const payload = verifyToken(tokenCookieValue);
      req.user = payload;
    } catch (error) {
      console.error('Token verification failed:', error);
    }

    next();
  };
}
