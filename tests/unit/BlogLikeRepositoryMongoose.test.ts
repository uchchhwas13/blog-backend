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

  it('should return a list of liked users with profile image URL', async () => {
    // Arrange
    const fakeUser = {
      _id: 'user123',
      name: 'John Doe',
      profileImageUrl: '/uploads/john.png',
    };
    Object.setPrototypeOf(fakeUser, User.prototype);
    const fakeLike = {
      userId: fakeUser, // simulating populated User
    };

    // Mock BlogLike.find().populate()
    (BlogLike.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([fakeLike]),
    });

    // Mock buildFileUrl
    (buildFileUrl as jest.Mock).mockImplementation((path: string) => `http://localhost${path}`);

    // Act
    const result = await repo.findUsersWhoLikedBlog('blog123');

    // Assert
    expect(BlogLike.find).toHaveBeenCalledWith({ blogId: 'blog123', isLiked: true });
    expect(result).toEqual([
      {
        id: 'user123',
        name: 'John Doe',
        profileImageUrl: 'http://localhost/uploads/john.png',
      },
    ]);
  });
});
