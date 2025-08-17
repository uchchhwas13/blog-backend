export type AuthPayload = {
  email: string;
  password: string;
};

export type SigninSuccessResponse = {
  success: true;
  message: string;
  data: {
    user: UserData;
    accessToken: string;
    refreshToken: string;
  };
};

export type ErrorResponse = {
  success: false;
  message: string;
};

type UserData = {
  _id: string;
  email: string;
  name: string;
  role: string;
};

export type SignupPayload = {
  fullname: string;
  email: string;
  password: string;
};

export type SignupSuccessResponse = {
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

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
