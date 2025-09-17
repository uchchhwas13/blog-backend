import { Request, Response } from 'express';
import { SignupPayload, SignupResponse } from '../types/auth.types';
import { signupUser } from '../services/auth.service';

export const handleSignup = async (
  req: Request<{}, {}, SignupPayload>,
  res: Response<SignupResponse>,
) => {
  const userData = await signupUser(req.body, req.file);

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user: userData },
  });
};
