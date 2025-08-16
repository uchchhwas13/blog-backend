import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccessToken } from '../services/authentication';
import { User } from '../models/user';

export function authenticateRequest(cookieName: string): RequestHandler {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.[cookieName] || req.headers?.authorization?.split(' ')[1];
    console.log('Token cookie value:', token);
    try {
      if (!token) {
        return next();
      }
      const payload = verifyAccessToken(token);
      const user = await User.findById(payload?.id).select('-password -refreshToken');

      if (!user) {
        throw new Error('Invalid Access Token');
      }
      req.user = payload;
      next();
    } catch (error) {
      throw new Error('Invalid Access Token');
    }
  };
}
