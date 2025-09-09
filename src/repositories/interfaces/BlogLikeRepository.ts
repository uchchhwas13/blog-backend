import { UserEntity } from './UserRepository';

export type BlogLikeEntity = {
  id: string;
  blogId: string;
  userId: string;
  isLiked: boolean;
};

export interface BlogLikeRepository {
  findLikedUsers(blogId: string): Promise<UserEntity[]>;
  updateLikeStatus(blogId: string, userId: string, isLiked: boolean): Promise<{ isLiked: boolean }>;
}
