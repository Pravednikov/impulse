import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { ServerHttpErrorResponse } from 'common/errorHandlers/serverErrorResponse';
import { CanGetEmailGuard } from 'common/guards/canGetEmail.guard';
import { IsAuthGuard } from 'common/guards/isAuth.guard';
import { User } from 'database/entities/user.entity';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @UseGuards(IsAuthGuard, CanGetEmailGuard)
  @Get('/:email')
  async getByEmail(@Param('email') email: string): Promise<User> {
    this.logger.log(`API V1 sign in`);

    const response = await this.userService.FindByEmail(email);

    if (!response.succeeded) {
      throw new ServerHttpErrorResponse(response);
    }

    return response.data;
  }
}
