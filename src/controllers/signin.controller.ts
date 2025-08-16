import { User } from '../models/user';
import { Request, Response } from 'express';
import { AuthPayload, SigninResponse } from '../types/auth.types';
import jwt from 'jsonwebtoken';
import { verifyRefreshToken } from '../services/authentication';
import { ApiError } from '../utils/ApiError';

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: false, // true if HTTPS
  maxAge: 60 * 1000, // 1 minute
};
const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: false, // true if HTTPS
  maxAge: 60 * 60 * 1000, // 1 hour
};

export const handleSignin = async (
  req: Request<{}, {}, AuthPayload>,
  res: Response<SigninResponse>,
) => {
  const { email, password } = req.body;
  const trimmedEmail = email.trim();
  const user = await User.findOne({ email: trimmedEmail });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'user not found',
    });
  }
  try {
    user.matchPassword(user, password);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    const userData = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return res
      .status(200)
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .send({
        success: true,
        message: 'Signin successful',
        data: {
          user: userData,
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect email or password',
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await User.findByIdAndUpdate(
    req.user.id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    },
  );
  req.user = null;
  return res
    .status(200)
    .clearCookie('accessToken', accessTokenCookieOptions)
    .clearCookie('refreshToken', refreshTokenCookieOptions)
    .json({ success: true, message: 'User logged Out' });
};

import { RequestHandler } from 'express';

export const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export const handleRefreshAccessToken = asyncHandler(
  async (req: Request<{}, {}, { refreshToken: string }>, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!refreshTokenSecret) {
      throw new ApiError(500, 'Internal server error');
    }

    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    try {
      const decodedToken = verifyRefreshToken(incomingRefreshToken);
      if (!decodedToken) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      const user = await User.findById(decodedToken.id);

      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, 'Refresh token is expired or used');
      }
      console.log('incomingRefreshToken:', incomingRefreshToken);
      console.log('user.refreshToken:', user.refreshToken);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      const result = await user.save({ validateBeforeSave: false });
      console.log('User after saving refresh token:', result);
      return res
        .status(200)
        .cookie('accessToken', accessToken, accessTokenCookieOptions)
        .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
        .json({
          data: { accessToken, refreshToken },
          message: 'Access token refreshed',
        });
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  },
);
