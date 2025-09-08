import { Request } from 'express';
import { Comment } from '../models/comment';
import { CommentData } from '../types/blog.type';
import { User } from '../models/user';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import { ApiError } from '../utils/ApiError';

export const addComment = async (
  blogId: string,
  userId: string,
  content: string,
  req: Request,
): Promise<CommentData> => {
  const comment = await Comment.create({
    content,
    createdBy: userId,
    blogId,
  });
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return {
    comment: {
      id: comment._id.toString(),
      content: comment.content,
      blogId: blogId,
      createdAt: comment.createdAt,
      createdBy: {
        name: user.name,
        imageUrl: buildFileUrl(req, user.profileImageUrl),
      },
    },
  };
};
