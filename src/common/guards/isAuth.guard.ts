import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

import { AuthService } from '../../modules/auth/auth.service';
import { CookieService } from '../../modules/cookie/cookie.service';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class IsAuthGuard implements CanActivate {
  private logger = new Logger(IsAuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug(`Processing authentication guard`);

    const response: Response = context.switchToHttp().getResponse();
    const request: Request = context.switchToHttp().getRequest();

    const { access_token, refresh_token } = request.cookies;
    const secret = this.configService.getOrThrow('env.secret');

    if (!access_token && !refresh_token) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    const [access, refresh] = await Promise.allSettled([
      this.jwtService.verifyAsync(access_token, { secret }),
      this.jwtService.verifyAsync(refresh_token, { secret }),
    ]);

    return (
      (await this.processToken(access)) ||
      (await this.processToken(refresh, response))
    );
  }

  private async processToken(
    token: PromiseSettledResult<any>,
    response?: Response,
  ): Promise<boolean> {
    if (
      token.status !== 'fulfilled' ||
      !Object.hasOwn(token.value, 'email') ||
      typeof token.value['email'] !== 'string'
    ) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    const userEmail = token.value['email'];
    const user = await this.userService.FindByEmail(userEmail);

    if (!user.succeeded) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    if (response) {
      const [access_token, refresh_token] =
        await this.authService.GenerateToken(user.data);
      this.cookieService.setTokensToCookies(response, {
        access_token,
        refresh_token,
      });
    }

    return true;
  }
}
