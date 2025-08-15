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

export type SigninErrorResponse = {
  success: false;
  message: string;
};

type UserData = {
  _id: string;
  email: string;
  name: string;
  role: string;
};

export type SigninResponse = SigninSuccessResponse | SigninErrorResponse;
