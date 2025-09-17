import { UserEntity } from './UserRepository';

export type BlogLikeEntity = {
  id: string;
  blogId: string;
  userId: string;
  isLiked: boolean;
};

export interface BlogLikeRepository {
  findUsersWhoLikedBlog(blogId: string): Promise<UserEntity[]>;
  updateLikeStatus(blogId: string, userId: string, isLiked: boolean): Promise<{ isLiked: boolean }>;
}
