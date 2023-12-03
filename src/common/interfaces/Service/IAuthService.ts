import { SignUpDto } from '../../../modules/auth/dtos/sign-up.dto';
import { ServiceResponse } from '../../types/ServiceResponse';

export type token = {
  access_token: string;
  refresh_token: string;
};

export interface IAuthService {
  SignIn(email: string, password: string): Promise<ServiceResponse<token>>;

  SignUp(userDto: SignUpDto): Promise<ServiceResponse<token>>;
}
