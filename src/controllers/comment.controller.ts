import { Response, Request } from 'express';
import { CommentResponse } from '../types/blog.type';
import { ApiError } from '../utils/ApiError';
import { addComment, updateComment } from '../services/comment.service';

export const handleAddComment = async (
  req: Request<{ blogId: string }, {}, { content: string }>,
  res: Response<CommentResponse>,
) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  const data = await addComment(req.params.blogId, req.user.id, req.body.content);
  return res.status(201).json({
    message: 'Comment added successfully',
    success: true,
    data,
  });
};

export const handleUpdateComment = async (
  req: Request<{ commentId: string }, {}, { content: string }>,
  res: Response<CommentResponse>,
) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  const data = await updateComment(req.params.commentId, req.user.id, req.body.content);
  return res.status(200).json({
    message: 'Comment updated successfully',
    success: true,
    data,
  });
};
