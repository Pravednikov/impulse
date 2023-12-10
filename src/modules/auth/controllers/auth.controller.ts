import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { UserService } from 'modules/user/services/user.service';

import { CookieService } from '../../cookie/services/cookie.service';
import { SignIn } from '../dtos/sign-in.request';
import { SignUp } from '../dtos/sign-up.request';
import { AuthService } from '../services/auth.service';

@SkipThrottle()
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cookieService: CookieService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signIn: SignIn,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.logger.log(`API V1 sign in`);

    const user = await this.userService.findByEmail(signIn.email);

    if (!user.succeeded) {
      throw new UnauthorizedException();
    }

    const validated = await this.authService.validate(
      user.data,
      signIn.password,
    );

    if (!validated.succeeded) {
      throw new UnauthorizedException(validated.message);
    }

    const token = await this.authService.generateToken(user.data);

    if (!token.succeeded) {
      throw new InternalServerErrorException(token.message);
    }

    this.cookieService.setTokensToCookies(res, token.data);
  }

  @Post('signup')
  async signUp(
    @Body() signUp: SignUp,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.logger.log(`API V1 sign up`);

    const candidate = await this.userService.findByEmail(signUp.email);

    if (candidate.succeeded) {
      throw new ConflictException('User with given email already exists');
    }

    const hashPassword = await this.authService.hashPassword(signUp.password);

    const user = await this.userService.create({
      ...signUp,
      password: hashPassword,
    });

    if (!user.succeeded) {
      throw new InternalServerErrorException(user.message);
    }

    const u = await this.userService.save(user.data);

    if (!u.succeeded) {
      throw new InternalServerErrorException(u.message);
    }

    const token = await this.authService.generateToken(user.data);

    if (!token.succeeded) {
      throw new InternalServerErrorException(token.message);
    }

    this.cookieService.setTokensToCookies(res, token.data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response): void {
    this.logger.log(`API V1 sign out`);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
