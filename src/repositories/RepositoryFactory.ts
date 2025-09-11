import { CommentRepository } from './interfaces/CommentRepository';
import { CommentRepositoryMongoose } from './mongoose/CommentRepositoryMongoose';
import { UserRepository } from './interfaces/UserRepository';
import { UserRepositoryMongoose } from './mongoose/UserRepositoryMongoose';
import { BlogLikeRepository } from './interfaces/BlogLikeRepository';
import { BlogLikeRepositoryMongoose } from './mongoose/BlogLikeRepositoryMongoose';

export class RepositoryFactory {
  private static commentRepo: CommentRepository;
  private static userRepo: UserRepository;
  private static blogLikeRepo: BlogLikeRepository;

  static getCommentRepository(): CommentRepository {
    if (!this.commentRepo) {
      this.commentRepo = new CommentRepositoryMongoose();
    }
    return this.commentRepo;
  }

  static getUserRepository(): UserRepository {
    if (!this.userRepo) {
      this.userRepo = new UserRepositoryMongoose();
    }
    return this.userRepo;
  }

  static getBlogLikeRepository(): BlogLikeRepository {
    if (!this.blogLikeRepo) {
      this.blogLikeRepo = new BlogLikeRepositoryMongoose();
    }
    return this.blogLikeRepo;
  }
}
