import { BlogLikeRepositoryMongoose } from '../../src/repositories/mongoose/BlogLikeRepositoryMongoose';
import { BlogLike } from '../../src/models/blogLike';
import { buildFileUrl } from '../../src/utils/fileUrlGenerator';
import { User } from '../../src/models/user';

jest.mock('../../src/models/blogLike');
jest.mock('../../src/models/user');
jest.mock('../../src/utils/fileUrlGenerator');

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
});
