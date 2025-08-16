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

export type SigninResponse = SigninSuccessResponse | ErrorResponse;
