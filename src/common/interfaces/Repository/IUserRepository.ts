import { User } from 'database/entities/user.entity';

import { SignUpDto } from '../../../modules/auth/dtos/sign-up.dto';

export type UserTypes = User;

export interface IUserRepository {
  Create(user: SignUpDto): Promise<UserTypes>;

  GetByEmail(email: string): Promise<UserTypes>;

  Save(user: UserTypes): Promise<UserTypes>;
}
