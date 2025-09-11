import { BlogLike } from '../../models/blogLike';
import { User } from '../../models/user';
import { Blog } from '../../models/blog';
import { buildFileUrl } from '../../utils/fileUrlGenerator';
import { BlogLikeRepository } from '../interfaces/BlogLikeRepository';
import { UserEntity } from '../interfaces/UserRepository';

export class BlogLikeRepositoryMongoose implements BlogLikeRepository {
  async findUsersWhoLikedBlog(blogId: string): Promise<UserEntity[]> {
    const likes = await BlogLike.find({ blogId, isLiked: true }).populate('userId');

    return likes.map((like) => {
      const user = like.userId instanceof User ? like.userId : null;
      return {
        id: user ? user._id.toString() : 'Unknown',
        name: user ? user.name : 'Unknown',
        profileImageUrl: buildFileUrl(user?.profileImageUrl ?? '/images/default.png'),
      };
    });
  }

  async updateLikeStatus(
    blogId: string,
    userId: string,
    isLiked: boolean,
  ): Promise<{ isLiked: boolean }> {
    const result = await BlogLike.findOneAndUpdate(
      { blogId, userId },
      { $set: { isLiked } },
      { upsert: true, new: false },
    );

    const previousIsLiked = result?.isLiked ?? false;
    const delta = previousIsLiked === isLiked ? 0 : isLiked ? 1 : -1;

    if (delta !== 0) {
      await Blog.updateOne({ _id: blogId }, { $inc: { likeCount: delta } });
    }

    return { isLiked };
  }
}
