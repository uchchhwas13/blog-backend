import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authentication';
import type { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export function checkAuthenticationCookie(cookieName: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const tokenCookieValue = req.cookies?.[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const payload: string | JwtPayload = verifyToken(tokenCookieValue);
      req.user = payload;
    } catch (error) {
      console.error('Token verification failed:', error);
    }

    next();
  };
}
