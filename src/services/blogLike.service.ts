import { BlogLike } from '../models/blogLike';
import { User } from '../models/user';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import { Request } from 'express';

export const getBlogLikesService = async (req: Request, blogId: string) => {
  const likes = await BlogLike.find({ blogId, isLiked: true }).populate('userId');

  return likes.map((like) => {
    const user = like.userId instanceof User ? like.userId : null;
    return {
      userId: user ? user._id.toString() : 'Unknown',
      name: user ? user.name : 'Unknown',
      imageUrl: buildFileUrl(req, user?.profileImageUrl ?? '/images/default.png'),
    };
  });
};
