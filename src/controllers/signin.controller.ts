import { User } from '../models/user';
import { Request, Response } from 'express';
import { AuthPayload, SigninResponse } from '../types/auth.types';
import { verifyRefreshToken } from '../services/authentication';
import { ApiError } from '../utils/ApiError';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../types/auth.types';
import { asyncHandler } from '../middlewares/asyncHandler';

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
      id: user._id.toString(),
      email: user.email,
      name: user.name,
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

export const logoutUser = async (req: Request<{}, {}, { userId: string }>, res: Response) => {
  await User.findByIdAndUpdate(req.body.userId, {
    $unset: {
      refreshToken: 1, // this removes the field from document
    },
  });
  req.user = null;
  return res
    .status(200)
    .clearCookie('accessToken', accessTokenCookieOptions)
    .clearCookie('refreshToken', refreshTokenCookieOptions)
    .json({ success: true, message: 'User logged Out' });
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
    return res
      .status(200)
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .json({
        data: { accessToken, refreshToken },
        message: 'Access token refreshed',
      });
  },
);
