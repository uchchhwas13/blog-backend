import { Response, Request } from 'express';
import { BlogLike } from '../models/blogLike';
import { BlogLikeResponse, BlogLikesResponse } from '../types/blog.type';
import { Blog } from '../models/blog';
import { getBlogLikesService } from '../services/blogLike.service';
import { ApiError } from '../utils/ApiError';

export const handleBlogLikeStatus = async (
  req: Request<{ blogId: string }, {}, { isLiked: boolean }>,
  res: Response<BlogLikeResponse>,
) => {
  const { blogId } = req.params;
  const { isLiked } = req.body;
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  const userId = req.user.id;

  const result = await BlogLike.findOneAndUpdate(
    { blogId, userId },
    { $set: { isLiked } },
    { upsert: true, new: false },
  );

  const previousIsLiked = result?.isLiked ?? false;
  const delta = previousIsLiked === isLiked ? 0 : isLiked ? 1 : -1;

  if (delta !== 0) {
    await Blog.updateOne({ _id: blogId }, { $inc: { likeCount: delta } });
  }

  return res.status(200).json({
    success: true,
    message: isLiked ? 'Blog liked successfully' : 'Blog unliked successfully',
    data: { isLiked },
  });
};

export const handleGetBlogLikes = async (
  req: Request<{ blogId: string }>,
  res: Response<BlogLikesResponse>,
) => {
  const { blogId } = req.params;

  const likeList = await getBlogLikesService(req, blogId);

  return res.status(200).json({
    success: true,
    message: 'Blog likes retrieved successfully',
    data: {
      totalLikes: likeList.length,
      users: likeList,
    },
  });
};
