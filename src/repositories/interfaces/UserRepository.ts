export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
}

export type UserEntity = {
  id: string;
  name: string;
  profileImageUrl: string;
};
