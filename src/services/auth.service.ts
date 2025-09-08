// services/auth.service.ts
import { User } from '../models/user';
import { ApiError } from '../utils/ApiError';
import { SigninSuccessData, UserData } from '../types/auth.types';
import { SignupPayload } from '../types/auth.types';

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
