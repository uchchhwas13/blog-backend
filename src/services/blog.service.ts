import { Blog } from '../models/blog';
import { Request } from 'express';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import {
  AddBlogPostPayload,
  BlogCreationResponse,
  BlogItem,
  BlogWithCommentsData,
} from '../types/blog.type';
import { UserTokenPayload } from './authentication';
import { Comment } from '../models/comment';
import { BlogLike } from '../models/blogLike';
import { User } from '../models/user';
import { ApiError } from '../utils/ApiError';

export const getBlogList = async (req: Request): Promise<BlogItem[]> => {
  const blogs = await Blog.find({}).populate('createdBy').sort({ createdAt: -1 });

  return blogs.map((blog) => ({
    id: blog._id.toString(),
    title: blog.title,
    coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
    createdAt: blog.createdAt,
  }));
};

export const addBlogPost = async (
  payload: AddBlogPostPayload,
  user: UserTokenPayload,
  req: Request,
): Promise<BlogCreationResponse> => {
  const blog = await Blog.create({
    title: payload.title,
    body: payload.body,
    coverImageUrl: `/uploads/${req.file?.filename}`,
    createdBy: user.id,
  });

  return {
    blog: {
      id: blog._id.toString(),
      title: blog.title,
      body: blog.body,
      coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
      createdBy: {
        id: user.id,
        name: user.name,
      },
      createdAt: blog.createdAt,
    },
  };
};

export const getBlogDetails = async (
  req: Request,
  blogId: string,
  userId?: string,
): Promise<BlogWithCommentsData> => {
  const blog = await Blog.findById(blogId).populate('createdBy');
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  const comments = await Comment.find({ blogId }).populate('createdBy').sort({ createdAt: -1 });

  let isLikedByUser = false;
  if (userId) {
    const result = await BlogLike.findOne({ blogId, userId });
    isLikedByUser = result?.isLiked ?? false;
  }

  const user = blog.createdBy instanceof User ? blog.createdBy : null;
  const sanitizedBlog = {
    id: blog._id.toString(),
    title: blog.title,
    body: blog.body,
    coverImageUrl: buildFileUrl(req, blog.coverImageUrl),
    isLikedByUser,
    totalLikes: blog.likeCount,
    createdBy: {
      name: user ? user.name : 'Unknown',
      imageUrl: user
        ? buildFileUrl(req, user.profileImageUrl)
        : buildFileUrl(req, '/images/default.png'),
    },
    createdAt: blog.createdAt,
  };

  const sanitizedComments = comments.map((comment) => {
    const user = comment.createdBy instanceof User ? comment.createdBy : null;
    return {
      id: comment._id.toString(),
      content: comment.content,
      createdBy: {
        name: user ? user.name : 'Unknown',
        imageUrl: user
          ? buildFileUrl(req, user.profileImageUrl)
          : buildFileUrl(req, '/images/default.png'),
      },
      createdAt: comment.createdAt,
    };
  });

  return {
    blog: sanitizedBlog,
    comments: sanitizedComments,
  };
};
