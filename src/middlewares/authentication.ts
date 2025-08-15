import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccessToken } from '../services/authentication';
import { User } from '../models/user';

export function checkAuthenticationCookie(cookieName: string): RequestHandler {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    const tokenCookieValue = req.cookies?.[cookieName] || req.headers?.authorization?.split(' ')[1];
    console.log('Token cookie value:', tokenCookieValue);
    try {
      if (!tokenCookieValue) {
        throw new Error('Unauthorized request');
      }
      const payload = verifyAccessToken(tokenCookieValue);
      const user = await User.findById(payload?.id).select('-password -refreshToken');

      if (!user) {
        throw new Error('Invalid Access Token');
      }
      req.user = payload;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new Error('Invalid Access Token');
    }
  };
}
