import { Response, Request } from 'express';
import { BlogLike } from '../models/blogLike';
import { BlogLikeResponse, BlogLikesResponse } from '../types/blog.type';
import { Blog } from '../models/blog';
import { getBlogLikes } from '../services/blogLike.service';
import { ApiError } from '../utils/ApiError';

import { updateBlogLikeStatus } from '../services/blogLike.service';

export const handleBlogLikeStatus = async (
  req: Request<{ blogId: string }, {}, { isLiked: boolean }>,
  res: Response<BlogLikeResponse>,
) => {
  const { blogId } = req.params;
  const { isLiked } = req.body;

  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = await updateBlogLikeStatus(blogId, req.user.id, isLiked);

  return res.status(200).json({
    success: true,
    message: isLiked ? 'Blog liked successfully' : 'Blog unliked successfully',
    data: result,
  });
};

export const handleGetBlogLikes = async (
  req: Request<{ blogId: string }>,
  res: Response<BlogLikesResponse>,
) => {
  const { blogId } = req.params;

  const likeList = await getBlogLikes(req, blogId);

  return res.status(200).json({
    success: true,
    message: 'Blog likes retrieved successfully',
    data: {
      totalLikes: likeList.length,
      users: likeList,
    },
  });
};
