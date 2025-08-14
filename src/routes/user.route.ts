import { Router } from 'express';
import { handleSignup } from '../controllers/signup.controller';
import { handleSignin } from '../controllers/signin.controller';
const userRouter = Router();
//TODO: Need to move this into frontend
userRouter.get('/signin', (req, res) => {
  return res.render('signin');
});

//TODO: Need to move this into frontend
userRouter.get('/signup', (req, res) => {
  return res.render('signup');
});

userRouter.post('/signin', handleSignin);
userRouter.post('/signup', handleSignup);

userRouter.get('/logout', (req, res) => {
  return res.clearCookie('token').redirect('/');
});

export default userRouter;
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
