import { Response, Request } from 'express';
import { BlogLike } from '../models/blogLike';
import { BlogLikeResponse, BlogLikesResponse } from '../types/blog.type';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Blog } from '../models/blog';
import { User } from '../models/user';
import { buildFileUrl } from '../utils/fileUrlGenerator';

export const handleBlogLikeStatus = asyncHandler(
  async (
    req: Request<{ blogId: string }, {}, { isLiked: boolean }>,
    res: Response<BlogLikeResponse>,
  ) => {
    const { blogId } = req.params;
    const { isLiked } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
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
  },
);

export const handleGetBlogLikes = asyncHandler(
  async (req: Request<{ blogId: string }>, res: Response<BlogLikesResponse>) => {
    const { blogId } = req.params;

    const likes = await BlogLike.find({ blogId, isLiked: true }).populate('userId');
    const likeList = likes.map((like) => ({
      userId: like.userId instanceof User ? like.userId._id.toString() : 'Unknown',
      name: like.userId instanceof User ? like.userId.name : 'Unknown',
      imageUrl:
        like.userId instanceof User
          ? buildFileUrl(req, like.userId.profileImageUrl)
          : buildFileUrl(req, '/images/default.png'),
    }));

    return res.status(200).json({
      success: true,
      message: 'Blog likes retrieved successfully',
      data: {
        totalLikes: likeList.length,
        users: likeList,
      },
    });
  },
);
