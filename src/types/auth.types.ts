export type AuthPayload = {
  email: string;
  password: string;
};

export type SigninSuccessResponse = {
  success: true;
  message: string;
};

export type SigninErrorResponse = {
  success: false;
  message: string;
};

export type SigninResponse = SigninSuccessResponse | SigninErrorResponse;
