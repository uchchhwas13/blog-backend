import { Response, Request } from 'express';
import type { UserTokenPayload } from '../services/authentication.middleware';
import { Blog, IBlog } from '../models/blog';
import { Comment, IComment } from '../models/comment';

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload | null;
    }
  }
}

type BlogWithCommentsSuccessResponse = {
  blog: IBlog;
  comments: IComment[];
};
type BlogWithCommentsResponse = BlogWithCommentsSuccessResponse | { error: string };

export const renderCreateBlogPage = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect('/user/signin');
  }

  return res.render('addBlog', {
    user: req.user,
  });
};

export const handleAddBlogPost = async (
  req: Request<
    {},
    {},
    {
      title: string;
      body: string;
    }
  >,
  res: Response,
) => {
  if (!req.file || !req.user) {
    return res.render('addBlog', {
      error: 'Invalid request',
    });
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

export const handleGetBlogDetails = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<BlogWithCommentsResponse>,
) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const comments = await Comment.find({ blogId: req.params.id })
      .populate('createdBy')
      .sort({ createdAt: -1 });

    return res.json({
      blog,
      comments,
    });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
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
