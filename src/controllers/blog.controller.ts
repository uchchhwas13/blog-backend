import { Response, Request } from 'express';
import type { UserTokenPayload } from '../services/authentication';
import { Blog } from '../models/blog';
import { Comment } from '../models/comment';
import { AddBlogPostPayload, BlogWithCommentsResponse } from '../types/blog.type';

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload | null;
    }
  }
}

export const handleAddBlogPost = async (
  req: Request<{}, {}, AddBlogPostPayload>,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File upload failed',
    });
  }

  const blog = await Blog.create({
    title: req.body.title,
    body: req.body.body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user.id,
  });
  console.log('Blog created successfully', blog);
  return res.status(201).json({
    success: true,
    message: 'Blog post created successfully',
    data: {
      blog: {
        id: blog._id.toString(),
        title: blog.title,
        body: blog.body,
        coverImageUrl: blog.coverImageUrl,
        createdBy: {
          id: req.user.id,
          name: req.user.name,
        },
        createdAt: blog.createdAt,
      },
    },
  });
};

export const handleGetBlogDetails = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<BlogWithCommentsResponse>,
) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comments = await Comment.find({ blogId: req.params.id })
      .populate('createdBy')
      .sort({ createdAt: -1 });

    return res.json({
      message: 'Blog details fetched successfully',
      success: true,
      data: {
        blog,
        comments,
      },
    });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
