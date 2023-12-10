import { User } from 'modules/user/entities/user.entity';

import { ServiceResponse } from '../../types/ServiceResponse';

export type token = {
  access_token: string;
  refresh_token: string;
};

export interface IAuthService {
  validate(user: User, password: string): Promise<ServiceResponse<void>>;

  hashPassword(password: string): Promise<string>;

  generateToken(user: User): Promise<ServiceResponse<token>>;
}
