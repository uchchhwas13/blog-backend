import { APIResponse } from '../utils/APIResponse';
export type AuthPayload = {
  email: string;
  password: string;
};

type UserData = {
  id: string;
  email: string;
  name: string;
};

export type SigninSuccessData = {
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
type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};
export type RefreshTokenResponse = APIResponse<TokenResponse> | ErrorResponse;
