import { Router } from 'express';
import { handleSignup } from '../controllers/signup.controller';
import {
  handleRefreshAccessToken,
  handleSignin,
  logoutUser,
} from '../controllers/signin.controller';
import { validateBody } from '../middlewares/validateBlog.middleware';
import { signupSchema } from '../validations/signupSchema';
import { signinSchema } from '../validations/signinSchema';

const userRouter = Router();

userRouter.post('/signin', validateBody(signinSchema), handleSignin);
userRouter.post('/signup', validateBody(signupSchema), handleSignup);

userRouter.post('/logout', logoutUser);
userRouter.post('/refresh-access-token', handleRefreshAccessToken);

export default userRouter;
