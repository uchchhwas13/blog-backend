import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccessToken } from '../services/authentication';
import { User } from '../models/user';
import { ApiError } from '../utils/ApiError';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

export async function authenticateRequest(req: Request, _: Response, next: NextFunction) {
  const token = req.headers?.authorization?.split(' ')[1];
  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload?.id).select('-password -refreshToken');
    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new ApiError(401, 'Access Token Expired');
    }
    if (err instanceof JsonWebTokenError) {
      throw new ApiError(401, 'Invalid Access Token');
    }
    throw err;
  }
}
