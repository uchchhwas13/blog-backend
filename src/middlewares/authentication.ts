import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserTokenPayload } from '../services/authentication';

export interface AuthRequest extends Request {
  user: UserTokenPayload | null;
}

export function checkAuthenticationCookie(cookieName: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const tokenCookieValue = req.cookies?.[cookieName];
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
