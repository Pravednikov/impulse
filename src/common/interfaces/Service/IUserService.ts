import { UserTypes } from 'common/interfaces/Repository/IUserRepository';

import { SignUpDto } from '../../../modules/auth/dtos/sign-up.dto';
import { ServiceResponse } from '../../types/ServiceResponse';

export interface IUserService {
  FindByEmail(email: string): Promise<ServiceResponse<UserTypes>>;

  Create(user: SignUpDto): Promise<ServiceResponse<UserTypes>>;

  Save(user: UserTypes): Promise<ServiceResponse<void>>;
}
