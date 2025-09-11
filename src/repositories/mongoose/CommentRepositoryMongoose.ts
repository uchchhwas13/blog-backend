import { Comment, IComment } from '../../models/comment';
import { ApiError } from '../../utils/ApiError';
import {
  CommentCreateInput,
  CommentEntity,
  CommentRepository,
} from '../interfaces/CommentRepository';

function map(comment: IComment): CommentEntity {
  return {
    id: comment._id.toString(),
    content: comment.content,
    blogId: comment.blogId.toString(),
    createdBy: comment.createdBy.toString(),
    createdAt: comment.createdAt,
  };
}

export class CommentRepositoryMongoose implements CommentRepository {
  async create(input: CommentCreateInput): Promise<CommentEntity> {
    const comment = await Comment.create({
      content: input.content,
      blogId: input.blogId,
      createdBy: input.createdBy,
    });
    return map(comment);
  }

  async findById(id: string): Promise<CommentEntity | null> {
    const comment = await Comment.findById(id);
    return comment ? map(comment) : null;
  }

  async updateContent(id: string, content: string): Promise<CommentEntity> {
    const comment = await Comment.findById(id);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }
    comment.content = content;
    await comment.save();
    return map(comment);
  }
}
