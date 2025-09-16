import { Router } from 'express';
import { handleSignup } from '../controllers/signup.controller';
import {
  handleRefreshAccessToken,
  handleSignin,
  logoutUser,
} from '../controllers/signin.controller';
import { validateBody } from '../middlewares/validateBody.middleware';
import { signupSchema } from '../validations/signupSchema';
import { signinSchema } from '../validations/signinSchema';
import { upload } from '../middlewares/multer.middleware';

const userRouter = Router();

userRouter.post('/signin', validateBody(signinSchema), handleSignin);
userRouter.post('/signup', upload.single('profileImage'), validateBody(signupSchema), handleSignup);

userRouter.post('/logout', logoutUser);
userRouter.post('/refresh-access-token', handleRefreshAccessToken);

export default userRouter;
