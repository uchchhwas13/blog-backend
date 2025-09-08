import { APIResponse } from '../utils/APIResponse';
export type AuthPayload = {
  email: string;
  password: string;
};

export type UserData = {
  id: string;
  email: string;
  name: string;
};

export type SigninSuccessData = {
  user: UserData;
  accessToken: string;
  refreshToken: string;
};

export type SigninResponse = APIResponse<SigninSuccessData>;

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

export type SignupResponse = APIResponse<SignupSuccessData>;

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};
export type RefreshTokenResponse = APIResponse<TokenResponse> | ErrorResponse;
