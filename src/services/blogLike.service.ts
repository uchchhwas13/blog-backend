import { RepositoryFactory } from '../repositories/RepositoryFactory';

export const getBlogLikes = async (blogId: string) => {
  const blogLikeRepo = RepositoryFactory.getBlogLikeRepository();
  return await blogLikeRepo.findLikedUsers(blogId);
};

export const updateBlogLikeStatus = async (blogId: string, userId: string, isLiked: boolean) => {
  const blogLikeRepo = RepositoryFactory.getBlogLikeRepository();
  return await blogLikeRepo.updateLikeStatus(blogId, userId, isLiked);
};
