import { User } from '../models/user';
import { ApiError } from '../utils/ApiError';
import { SigninSuccessData, TokenResponse, UserData } from '../types/auth.types';
import { SignupPayload } from '../types/auth.types';

export const signinUser = async (email: string, password: string): Promise<SigninSuccessData> => {
  const trimmedEmail = email.trim();
  const user = await User.findOne({ email: trimmedEmail });

  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  user.matchPassword(user, password);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    accessToken,
    refreshToken,
  };
};

export const signupUser = async (
  payload: SignupPayload,
  file?: Express.Multer.File,
): Promise<UserData> => {
  const { fullname, email, password } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const profileImageUrl = file ? `/uploads/${file.filename}` : '/images/default.png';

  const result = await User.create({
    name: fullname,
    email,
    password,
    profileImageUrl,
  });

  return {
    id: result._id.toString(),
    name: result.name,
    email: result.email,
  };
};

export const refreshAccessToken = async (
  tokenId: string,
  incomingRefreshToken: string,
): Promise<TokenResponse> => {
  const user = await User.findById(tokenId);
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
  return { accessToken, refreshToken };
};
