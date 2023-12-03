import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ServerHttpErrorResponse } from 'common/errorHandlers/serverErrorResponse';
import { Response } from 'express';

import { CookieService } from '../cookie/cookie.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@SkipThrottle()
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.logger.log(`API V1 sign in`);

    const response = await this.authService.SignIn(
      signInDto.email,
      signInDto.password,
    );

    if (!response.succeeded) {
      throw new ServerHttpErrorResponse(response);
    }

    this.cookieService.setTokensToCookies(res, response.data);
  }

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(`API V1 sign up`);

    const response = await this.authService.SignUp(signUpDto);

    if (!response.succeeded) {
      throw new ServerHttpErrorResponse(response);
    }

    this.cookieService.setTokensToCookies(res, response.data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response): void {
    this.logger.log(`API V1 sign out`);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
