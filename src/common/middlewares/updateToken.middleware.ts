import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../../modules/auth/auth.service';
import { CookieService } from '../../modules/cookie/cookie.service';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class UpdateTokenMiddleware implements NestMiddleware {
  private logger = new Logger(UpdateTokenMiddleware.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug(`Processing update token`);

    const { access_token, refresh_token } = req.cookies;
    const secret = this.configService.getOrThrow('env.secret');

    if (!access_token && !refresh_token) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    const [access, refresh] = await Promise.allSettled([
      this.jwtService.verifyAsync(access_token, { secret }),
      this.jwtService.verifyAsync(refresh_token, { secret }),
    ]);

    if (
      !(await this.processToken(access)) &&
      !(await this.processToken(refresh, res))
    ) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    return next();
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
      return false;
    }

    const userEmail = token.value['email'];
    const user = await this.userService.FindByEmail(userEmail);

    if (!user.succeeded) {
      return false;
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
