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
    console.log('Generated token:', token);
    return res.cookie('token', token).redirect('/');
  } catch (error) {
    return res.render('signin', {
      error: 'Incorrect email or password',
    });
    // return res.status(401).json({
    //   success: false,
    //   message: 'Incorrect email or password'});
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
