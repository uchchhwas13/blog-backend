import { BlogLike } from '../models/blogLike';
import { User } from '../models/user';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import { Request } from 'express';
import { Blog } from '../models/blog';

export const getBlogLikes = async (blogId: string) => {
  const likes = await BlogLike.find({ blogId, isLiked: true }).populate('userId');

  return likes.map((like) => {
    const user = like.userId instanceof User ? like.userId : null;
    return {
      userId: user ? user._id.toString() : 'Unknown',
      name: user ? user.name : 'Unknown',
      imageUrl: buildFileUrl(user?.profileImageUrl ?? '/images/default.png'),
    };
  });
};

export const updateBlogLikeStatus = async (blogId: string, userId: string, isLiked: boolean) => {
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

  return { isLiked };
};
