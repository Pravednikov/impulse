import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'modules/auth/services/auth.service';
import { CookieService } from 'modules/cookie/services/cookie.service';
import { UserService } from 'modules/user/services/user.service';

@Injectable()
export class UpdateTokenMiddleware implements NestMiddleware {
  private logger = new Logger(UpdateTokenMiddleware.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private cookieService: CookieService,
    private authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug(`Processing update token`);

    const { access_token, refresh_token } = req.cookies;

    if (!access_token && !refresh_token) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    const [access, refresh] = await Promise.allSettled([
      this.jwtService.verifyAsync(access_token),
      this.jwtService.verifyAsync(refresh_token),
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
    const user = await this.userService.findByEmail(userEmail);

    if (!user.succeeded) {
      return false;
    }

    if (response) {
      const token = await this.authService.generateToken(user.data);

      if (!token.succeeded) {
        throw new InternalServerErrorException(token.message);
      }

      const { access_token, refresh_token } = token.data;

      this.cookieService.setTokensToCookies(response, {
        access_token,
        refresh_token,
      });
    }

    return true;
  }
}
