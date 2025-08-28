import { Response, Request } from 'express';
import { Comment } from '../models/comment';
import { CommentResponse } from '../types/blog.type';
import { User } from '../models/user';
import { buildFileUrl } from '../utils/fileUrlGenerator';

export const handleAddComment = async (
  req: Request<{ blogId: string }, {}, { content: string }>,
  res: Response<CommentResponse>,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const comment = await Comment.create({
    content: req.body.content,
    createdBy: req.user.id,
    blogId: req.params.blogId,
  });
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
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
