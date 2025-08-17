import { APIResponse } from '../utils/APIResponse';
export type AuthPayload = {
  email: string;
  password: string;
};

type UserData = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type SigninSuccessData = {
  user: UserData;
  accessToken: string;
  refreshToken: string;
};

export type SigninSuccessResponse = APIResponse<SigninSuccessData>;

export type ErrorResponse = {
  success: false;
  message: string;
};

export type SignupPayload = {
  fullname: string;
  email: string;
  password: string;
};

type SignupSuccessData = {
  user: UserData;
};

export type SignupSuccessResponse = APIResponse<SignupSuccessData>;

export type SigninResponse = SigninSuccessResponse | ErrorResponse;
export type SignupResponse = SignupSuccessResponse | ErrorResponse;

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: false, // true if HTTPS
  maxAge: 60 * 1000, // 1 minute
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: false, // true if HTTPS
  maxAge: 60 * 60 * 1000, // 1 hour
};
