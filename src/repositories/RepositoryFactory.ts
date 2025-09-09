import { CommentRepository } from './interfaces/CommentRepository';
import { CommentRepositoryMongoose } from './mongoose/CommentRepositoryMongoose';
import { UserRepository } from './interfaces/UserRepository';
import { UserRepositoryMongoose } from './mongoose/UserRepositoryMongoose';

export class RepositoryFactory {
  private static commentRepo: CommentRepository;
  private static userRepo: UserRepository;

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
}
