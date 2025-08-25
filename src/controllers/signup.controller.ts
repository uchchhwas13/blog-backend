import { Request, Response } from 'express';
import { User } from '../models/user';
import { SignupPayload, SignupResponse } from '../types/auth.types';

export const handleSignup = async (
  req: Request<{}, {}, SignupPayload>,
  res: Response<SignupResponse>,
) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : '/images/default.png';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const result = await User.create({
      name: fullname,
      email,
      password,
      profileImageUrl,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: result._id.toString(),
          name: result.name,
          email: result.email,
        },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
