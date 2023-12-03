import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { serverErrorResponse } from 'common/errorHandlers/serverErrorResponse';
import { UserTypes } from 'common/interfaces/Repository/IUserRepository';
import { IUserService } from 'common/interfaces/Service/IUserService';
import { ServiceResponse } from 'common/types/ServiceResponse';
import { User } from 'database/entities/user.entity';

import { SignUpDto } from '../auth/dtos/sign-up.dto';
import { UserRepository } from './repo/user.repository';

@Injectable()
export class UserService implements IUserService {
  private logger = new Logger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async FindByEmail(email: string): Promise<ServiceResponse<User>> {
    this.logger.debug(`Processing find user for email: ${email}`);

    try {
      const user = await this.userRepository.GetByEmail(email);

      if (!user) {
        return {
          succeeded: false,
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      return { succeeded: true, message: 'User has been found', data: user };
    } catch (error: unknown) {
      this.logger.error(`Processing find user by email failed for ${email}`);
      return serverErrorResponse(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async Create(userDto: SignUpDto): Promise<ServiceResponse<UserTypes>> {
    this.logger.debug(`Processing new user`);

    try {
      const user = await this.userRepository.Create(userDto);

      if (!user) {
        return { succeeded: false, message: "Couldn't create new user" };
      }

      return { succeeded: true, message: 'User has been found', data: user };
    } catch (error: unknown) {
      this.logger.error(`Processing new user failed`);
      return serverErrorResponse(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async Save(user: UserTypes): Promise<ServiceResponse<void>> {
    this.logger.debug(`Processing save user for email: ${user.email}`);

    try {
      await this.userRepository.Save(user);
      return { succeeded: true, message: 'User has been saved' };
    } catch (error: unknown) {
      this.logger.error(`Processing save user failed for email: ${user.email}`);
      return serverErrorResponse(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
