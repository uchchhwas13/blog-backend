import { Router } from 'express';
import { handleSignup } from '../controllers/signup.controller';
import { handleSignin, logoutUser } from '../controllers/signin.controller';
import { validateBody } from '../middlewares/validateBlog.middleware';
import { signupSchema } from '../validations/signupSchema';
import { signinSchema } from '../validations/signinSchema';

const userRouter = Router();

userRouter.post('/signin', validateBody(signinSchema), handleSignin);
userRouter.post('/signup', validateBody(signupSchema), handleSignup);

userRouter.post('/logout', logoutUser);

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
