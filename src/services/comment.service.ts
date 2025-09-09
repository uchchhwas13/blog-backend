import { Request } from 'express';
import { CommentData } from '../types/blog.type';
import { buildFileUrl } from '../utils/fileUrlGenerator';
import { ApiError } from '../utils/ApiError';
import { CommentRepository } from '../repositories/interfaces/CommentRepository';
import { CommentRepositoryMongoose } from '../repositories/mongoose/CommentRepositoryMongoose';
import { UserRepository } from '../repositories/interfaces/UserRepository';
import { UserRepositoryMongoose } from '../repositories/mongoose/UserRepositoryMongoose';

// Repository instance (could be injected via a factory/container if preferred)
const commentRepo: CommentRepository = new CommentRepositoryMongoose();
const userRepo: UserRepository = new UserRepositoryMongoose();

export const addComment = async (
  blogId: string,
  userId: string,
  content: string,
  req: Request,
): Promise<CommentData> => {
  const comment = await commentRepo.create({
    content,
    createdBy: userId,
    blogId,
  });
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return {
    comment: {
      id: comment.id,
      content: comment.content,
      blogId: comment.blogId,
      createdAt: comment.createdAt,
      createdBy: {
        name: user.name,
        imageUrl: buildFileUrl(req, user.profileImageUrl),
      },
    },
  };
};

export const updateComment = async (
  commentId: string,
  userId: string,
  content: string,
  req: Request,
): Promise<CommentData> => {
  const existing = await commentRepo.findById(commentId);
  if (!existing) {
    throw new ApiError(404, 'Comment not found');
  }
  if (existing.createdBy !== userId) {
    throw new ApiError(403, 'Forbidden: You can only update your own comments');
  }
  const updated = await commentRepo.updateContent(commentId, content);
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return {
    comment: {
      id: updated.id,
      content: updated.content,
      blogId: updated.blogId.toString(),
      createdAt: updated.createdAt,
      createdBy: {
        name: user.name,
        imageUrl: buildFileUrl(req, user.profileImageUrl),
      },
    },
  };
};
