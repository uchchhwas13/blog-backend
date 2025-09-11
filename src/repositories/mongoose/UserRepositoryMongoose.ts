import { IUser, User } from '../../models/user';
import { UserEntity, UserRepository } from '../interfaces/UserRepository';

function map(user: IUser): UserEntity {
  return {
    id: user._id.toString(),
    name: user.name,
    profileImageUrl: user.profileImageUrl,
  };
}

export class UserRepositoryMongoose implements UserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    const user = await User.findById(id);
    return user ? map(user) : null;
  }
}
