import { Response, Request } from 'express';
import type { UserTokenPayload } from '../services/authentication';

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload | null;
    }
  }
}

export const handleAddnewBlog = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect('/user/signin');
  }

  return res.render('addBlog', {
    user: req.user,
  });
};
