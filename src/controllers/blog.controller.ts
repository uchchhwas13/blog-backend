import { Response, Request } from 'express';
import type { UserTokenPayload } from '../services/authentication';
import { Blog, IBlog } from '../models/blog';
import { Comment } from '../models/comment';

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

export const handleGetBlogDetails = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
  console.log('Blog details:', blog);
  console.log('Comments', comments);
  return res.render('blogDetails', {
    user: req.user,
    blog: blog,
    comments: comments,
  });
};

export const handleAddComment = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const comment = await Comment.create({
    content: req.body.content,
    createdBy: req.user.id,
    blogId: req.params.blogId,
  });
  console.log('Comment created:', comment);
  return res.redirect(`/blog/${req.params.blogId}`);
};
