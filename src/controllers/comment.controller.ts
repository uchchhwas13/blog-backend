import { Response, Request } from 'express';
import { Comment } from '../models/comment';

export const handleAddComment = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const comment = await Comment.create({
    content: req.body.content,
    createdBy: req.user.id,
    blogId: req.params.blogId,
  });
  console.log('Comment created:', comment);
  return res.redirect(`/blog/${req.params.blogId}`);
};
