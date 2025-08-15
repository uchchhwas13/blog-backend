import { User } from '../models/user';
import { Request, Response } from 'express';
import { AuthPayload, SigninResponse } from '../types/auth.types';
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
