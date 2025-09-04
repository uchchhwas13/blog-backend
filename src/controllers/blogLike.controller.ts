import { Response, Request } from 'express';
import { asyncHandler } from './signin.controller';
import { BlogLike } from '../models/blogLike';
import { BlogLikeResponse } from '../types/blog.type';

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
    let result = await BlogLike.findOne({ blogId, userId });

    if (result) {
      result.isLiked = isLiked;
      await result.save();
    } else {
      result = await BlogLike.create({ blogId, userId, isLiked });
    }

    return res.status(200).json({
      success: true,
      message: isLiked ? 'Blog liked successfully' : 'Blog unliked successfully',
      data: {
        isLiked: result.isLiked,
      },
    });
  },
);
