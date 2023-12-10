import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'common/interfaces/Repository/IUserRepository';
import { SignUp } from 'modules/auth/dtos/sign-up.request';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  private logger = new Logger(UserRepository.name);

  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  public async create(user: SignUp): Promise<User> {
    this.logger.debug(`DB: creating user`);
    return this.repository.create(user);
  }

  public async getByEmail(email: string): Promise<User> {
    this.logger.debug(`DB: finding user with email: ${email}`);
    return this.repository.findOne({
      where: { email },
    });
  }

  public async save(user: User): Promise<User> {
    this.logger.debug(`DB: saving user`);
    return this.repository.save(user);
  }
}
