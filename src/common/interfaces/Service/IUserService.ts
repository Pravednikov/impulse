import { UserTypes } from 'common/interfaces/Repository/IUserRepository';
import { SignUp } from 'modules/auth/dtos/sign-up.request';

import { ServiceResponse } from '../../types/ServiceResponse';

export interface IUserService {
  findByEmail(email: string): Promise<ServiceResponse<UserTypes>>;

  create(user: SignUp): Promise<ServiceResponse<UserTypes>>;

  save(user: UserTypes): Promise<ServiceResponse<void>>;
}
