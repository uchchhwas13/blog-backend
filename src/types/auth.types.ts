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
