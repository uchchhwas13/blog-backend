import { Response, Request } from 'express';
import type { UserTokenPayload } from '../services/authentication';
import { Blog } from '../models/blog';
import { Comment } from '../models/comment';
import { User } from '../models/user';

import {
  AddBlogPostPayload,
  BlogWithCommentsResponse,
  BlogPostResponse,
  BlogListAPIResponse,
} from '../types/blog.type';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import { BlogLike } from '../models/blogLike';

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload | null;
    }
  }
}

export const handleGetBlogList = async (req: Request, res: Response<BlogListAPIResponse>) => {
  try {
    const blogs = await Blog.find({}).populate('createdBy').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Blog list fetched successfully',
      data: {
        blogs: blogs.map((blog) => ({
          id: blog._id.toString(),
          title: blog.title,
          coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
          createdAt: blog.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching blog list:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const handleAddBlogPost = async (
  req: Request<{}, {}, AddBlogPostPayload>,
  res: Response<BlogPostResponse>,
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
  return res.status(201).json({
    success: true,
    message: 'Blog post created successfully',
    data: {
      blog: {
        id: blog._id.toString(),
        title: blog.title,
        body: blog.body,
        coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
        createdBy: {
          name: req.user.name,
          id: req.user.id,
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

    let isLikedByUser = false;
    if (req.user) {
      const result = await BlogLike.findOne({ blogId: req.params.id, userId: req.user.id });
      isLikedByUser = result?.isLiked ?? false;
    }
    const sanitizedBlog = {
      id: blog._id.toString(),
      title: blog.title,
      body: blog.body,
      coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
      isLikedByUser: isLikedByUser,
      likeCount: blog.likeCount,
      createdBy: {
        name: blog.createdBy instanceof User ? blog.createdBy.name : 'Unknown',
        imageUrl:
          blog.createdBy instanceof User
            ? buildFileUrl(req, blog.createdBy.profileImageUrl)
            : buildFileUrl(req, '/images/default.png'),
      },
      createdAt: blog.createdAt,
    };
    const sanitizedComments = comments.map((comment) => ({
      id: comment._id.toString(),
      content: comment.content,
      createdBy: {
        name: comment.createdBy instanceof User ? comment.createdBy.name : 'Unknown',
        imageUrl:
          comment.createdBy instanceof User
            ? buildFileUrl(req, comment.createdBy.profileImageUrl)
            : buildFileUrl(req, '/images/default.png'),
      },
      createdAt: comment.createdAt,
    }));

    return res.json({
      message: 'Blog details fetched successfully',
      success: true,
      data: {
        blog: sanitizedBlog,
        comments: sanitizedComments,
      },
    });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
