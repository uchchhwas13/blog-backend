import { User } from '../models/user';
import { Request, Response } from 'express';
import { AuthPayload, SigninResponse } from '../types/auth.types';

export const handleSignin = async (
  req: Request<{}, {}, AuthPayload>,
  res: Response<SigninResponse>,
) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: 'Login successful',
      });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Incorrect email or password',
    });
  }
};

// router.post('/signin', async (req, res) => {
//   console.log('from post sign in', req.body);
//   const { email, password } = req.body;
//   try {
//     const token = await User.matchPasswordAndGenerateToken(email, password);
//     return res.cookie('token', token).redirect('/');
//   } catch (error) {
//     return res.render('signin', {
//       error: 'Incorrect email or password',
//     });
//   }
// });
