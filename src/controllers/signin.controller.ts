import { User } from '../models/user';
import { Request, Response } from 'express';
import { AuthPayload, RefreshTokenResponse, SignupSuccessResponse } from '../types/auth.types';
import { verifyRefreshToken } from '../services/authentication';
import { ApiError } from '../utils/ApiError';
import { signinUser } from '../services/auth.service';
import { ca } from 'zod/v4/locales/index.cjs';

export const handleSignin = async (
  req: Request<{}, {}, AuthPayload>,
  res: Response<SignupSuccessResponse>,
) => {
  const { email, password } = req.body;
  const data = await signinUser(email, password);

  const response: SignupSuccessResponse = {
    success: true,
    message: 'Signin successful',
    data: data,
  };
  return res.status(200).json(response);
};

export const logoutUser = async (req: Request<{}, {}, { userId: string }>, res: Response) => {
  await User.findByIdAndUpdate(req.body.userId, {
    $unset: {
      refreshToken: 1, // this removes the field from document
    },
  });
  req.user = null;
  return res.status(200).json({ success: true, message: 'User logged Out' });
};

export const handleRefreshAccessToken = async (
  req: Request<{}, {}, { refreshToken: string }>,
  res: Response<RefreshTokenResponse>,
) => {
  const incomingRefreshToken = req.body.refreshToken;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!refreshTokenSecret) {
    throw new ApiError(500, 'Internal server error');
  }

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }
  const decodedToken = verifyRefreshToken(incomingRefreshToken);
  if (!decodedToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  const result = await user.save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
    data: { accessToken, refreshToken },
    message: 'Access token refreshed',
  });
};
