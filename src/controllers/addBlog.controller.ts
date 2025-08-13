import { Response, Request } from 'express';
import type { UserTokenPayload } from '../services/authentication';
import { Blog, IBlog } from '../models/blog';

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

export const handleAddBlogPost = async (req: Request<{}, {}, IBlog>, res: Response) => {
  console.log('Request body for adding blog', req.body);
  console.log('Request user:', req.user);
  console.log('Uploaded file:', req.file);
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Cover image is required' });
  }

  const blog = await Blog.create({
    title: req.body.title,
    body: req.body.body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user.id,
  });
  console.log('Blog created successfully', blog);
  return res.redirect(`/blog/${blog._id}`);
};
