// services/auth.service.ts
import { User } from '../models/user';
import { ApiError } from '../utils/ApiError';
import { SigninSuccessData } from '../types/auth.types';

export async function signinUser(email: string, password: string): Promise<SigninSuccessData> {
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
}
