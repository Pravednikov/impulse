import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'common/interfaces/Repository/IUserRepository';
import { User } from 'database/entities/user.entity';
import { Repository } from 'typeorm';

import { SignUpDto } from '../../auth/dtos/sign-up.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  private logger = new Logger(UserRepository.name);

  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  public async Create(user: SignUpDto): Promise<User> {
    this.logger.debug(`DB: creating user`);
    return this.repository.create(user);
  }

  public async GetByEmail(email: string): Promise<User> {
    this.logger.debug(`DB: finding user with email: ${email}`);
    return this.repository.findOne({
      where: { email },
    });
  }

  public async Save(user: User): Promise<User> {
    this.logger.debug(`DB: saving user`);
    return this.repository.save(user);
  }
}
