import { SignUp } from 'modules/auth/dtos/sign-up.request';
import { User } from 'modules/user/entities/user.entity';

export type UserTypes = User;

export interface IUserRepository {
  create(user: SignUp): Promise<UserTypes>;

  getByEmail(email: string): Promise<UserTypes>;

  save(user: UserTypes): Promise<UserTypes>;
}
