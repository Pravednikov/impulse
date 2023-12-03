import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CanGetEmailGuard implements CanActivate {
  private logger = new Logger(CanGetEmailGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug(`Processing authentication guard`);

    try {
      const request: Request = context.switchToHttp().getRequest();

      const { refresh_token } = request.cookies;
      const email = request.params['email'];

      if (!refresh_token) {
        return false;
      }

      const refresh = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.getOrThrow('env.secret'),
      });

      return refresh['email'] === email;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
