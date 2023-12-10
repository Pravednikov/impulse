import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CanGetUserByEmailGuard implements CanActivate {
  private logger = new Logger(CanGetUserByEmailGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug(`Processing authentication guard`);

    try {
      const request: Request = context.switchToHttp().getRequest();

      const refresh_token: string = request.cookies['refresh_token'];
      const email = request.params['email'];

      if (!refresh_token) {
        return false;
      }

      const refresh = await this.jwtService.verifyAsync(refresh_token);

      return refresh['email'] === email;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
