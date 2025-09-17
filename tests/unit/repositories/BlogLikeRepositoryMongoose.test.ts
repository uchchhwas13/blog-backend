import { BlogLikeRepositoryMongoose } from '../../../src/repositories/mongoose/BlogLikeRepositoryMongoose';
import { BlogLike } from '../../../src/models/blogLike';
import { buildFileUrl } from '../../../src/utils/fileUrlGenerator';
import { User } from '../../../src/models/user';
import { Blog } from '../../../src/models/blog';

jest.mock('../../../src/models/blogLike');
jest.mock('../../../src/models/user');
jest.mock('../../../src/utils/fileUrlGenerator');
jest.mock('../../../src/models/blog');

describe('BlogLikeRepositoryMongoose', () => {
  let repo: BlogLikeRepositoryMongoose;

  beforeEach(() => {
    repo = new BlogLikeRepositoryMongoose();
    jest.clearAllMocks();
  });

  const createFakeUser = (): typeof User => {
    const user: any = {
      _id: 'user123',
      name: 'John Doe',
      profileImageUrl: '/uploads/john.png',
    };
    Object.setPrototypeOf(user, User.prototype); // make instanceof User work
    return user;
  };

  const mockLikesQuery = (likes: any[]) => {
    (BlogLike.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(likes),
    });
  };

  const mockFileUrl = (expectedUrl: string) => {
    (buildFileUrl as jest.Mock).mockImplementation(() => expectedUrl);
  };

  it('should return a list of liked users with profile image URL', async () => {
    // Arrange
    const fakeUser = createFakeUser();
    mockLikesQuery([{ userId: fakeUser }]);
    const expectedUrl = `http://localhost${fakeUser.profileImageUrl}`;
    mockFileUrl(expectedUrl);

    // Act
    const result = await repo.findUsersWhoLikedBlog('blog123');

    // Assert
    expect(BlogLike.find).toHaveBeenCalledWith({ blogId: 'blog123', isLiked: true });
    expect(result).toEqual([
      {
        id: 'user123',
        name: 'John Doe',
        profileImageUrl: expectedUrl,
      },
    ]);
  });

  it('should return an empty array if no user liked the blog', async () => {
    // Arrange
    mockLikesQuery([]); // no likes

    // Act
    const result = await repo.findUsersWhoLikedBlog('blog123');

    // Assert
    expect(BlogLike.find).toHaveBeenCalledWith({ blogId: 'blog123', isLiked: true });
    expect(result).toEqual([]);
  });

  const mockPreviousLike = (previousIsLiked: boolean) => {
    (BlogLike.findOneAndUpdate as jest.Mock).mockResolvedValue({ isLiked: previousIsLiked });
  };

  it('should like a blog that was not previously liked', async () => {
    mockPreviousLike(false);
    const BLOG_ID = 'blog123';
    const USER_ID = 'user456';
    const isLiked = true;
    const result = await repo.updateLikeStatus(BLOG_ID, USER_ID, isLiked);

    expect(BlogLike.findOneAndUpdate).toHaveBeenCalledWith(
      { blogId: BLOG_ID, userId: USER_ID },
      expect.anything(),
      expect.anything(),
    );
    expect(result).toEqual({ isLiked });
  });
});
