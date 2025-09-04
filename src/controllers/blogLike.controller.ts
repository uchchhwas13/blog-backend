import { Response, Request } from 'express';
import { BlogLike } from '../models/blogLike';
import { BlogLikeResponse } from '../types/blog.type';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Blog } from '../models/blog';
import { de } from 'zod/v4/locales/index.cjs';

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
