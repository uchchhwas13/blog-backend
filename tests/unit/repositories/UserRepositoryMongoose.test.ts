import { UserRepositoryMongoose } from '../../../src/repositories/mongoose/UserRepositoryMongoose';
import { User } from '../../../src/models/user';

jest.mock('../../../src/models/user');

describe('UserRepositoryMongoose', () => {
  let repo: UserRepositoryMongoose;

  beforeEach(() => {
    repo = new UserRepositoryMongoose();
    jest.clearAllMocks();
  });

  it('should return a mapped UserEntity when user is found', async () => {
    const userId = '123';
    const mockUser = {
      _id: { toString: () => userId },
      name: 'Alice',
      profileImageUrl: 'http://img.com/a.png',
    };
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await repo.findById(userId);

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual({
      id: userId,
      name: 'Alice',
      profileImageUrl: 'http://img.com/a.png',
    });
  });
});
