import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CanGetUserByEmailGuard } from 'common/guards/canGetUserByEmail.guard';

import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @UseGuards(CanGetUserByEmailGuard)
  @Get('/:email')
  async getByEmail(@Param('email') email: string): Promise<User> {
    this.logger.log(`API V1 get user by email`);

    const response = await this.userService.findByEmail(email);

    if (!response.succeeded) {
      throw new InternalServerErrorException(response.message);
    }

    return response.data;
  }
}
