import { Response, Request } from 'express';
import { Comment } from '../models/comment';
import { CommentResponse } from '../types/blog.type';
import { User } from '../models/user';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import { ApiError } from '../utils/ApiError';

export const handleAddComment = async (
  req: Request<{ blogId: string }, {}, { content: string }>,
  res: Response<CommentResponse>,
) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  const comment = await Comment.create({
    content: req.body.content,
    createdBy: req.user.id,
    blogId: req.params.blogId,
  });
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.status(201).json({
    message: 'Comment added successfully',
    success: true,
    data: {
      comment: {
        id: comment._id.toString(),
        content: comment.content,
        blogId: req.params.blogId,
        createdAt: comment.createdAt,
        createdBy: {
          name: user.name,
          imageUrl: buildFileUrl(req, user.profileImageUrl),
        },
      },
    },
  });
};
