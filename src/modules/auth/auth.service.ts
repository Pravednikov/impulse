import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { serverErrorResponse } from 'common/errorHandlers/serverErrorResponse';
import { IAuthService, token } from 'common/interfaces/Service/IAuthService';
import { ServiceResponse } from 'common/types/ServiceResponse';
import { User } from 'database/entities/user.entity';

import { UserService } from '../user/user.service';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService implements IAuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async SignIn(
    email: string,
    password: string,
  ): Promise<ServiceResponse<token>> {
    this.logger.debug(`Processing signIn`);

    try {
      const user = await this.Validate(email, password);

      if (!user.succeeded) {
        return user as unknown as ServiceResponse<token>;
      }

      const [access_token, refresh_token] = await this.GenerateToken(user.data);

      return {
        succeeded: true,
        message: 'Token has been generated',
        data: {
          access_token,
          refresh_token,
        },
      };
    } catch (error: unknown) {
      this.logger.error(`Processing signIn failed`);
      return serverErrorResponse(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async SignUp(userDto: SignUpDto): Promise<ServiceResponse<token>> {
    this.logger.debug(`Processing sign up`);

    try {
      const candidate = await this.userService.FindByEmail(userDto.email);

      if (candidate.succeeded) {
        return {
          succeeded: false,
          message: 'User with given email already exists',
          statusCode: HttpStatus.CONFLICT,
        };
      }

      const hashPassword = await bcrypt.hash(userDto.password, 5);
      const user = await this.userService.Create({
        ...userDto,
        password: hashPassword,
      });

      if (!user.succeeded) {
        return user as unknown as ServiceResponse<token>;
      }

      const u = await this.userService.Save(user.data);

      if (!u.succeeded) {
        return u as unknown as ServiceResponse<token>;
      }

      const [access_token, refresh_token] = await this.GenerateToken(user.data);

      return {
        succeeded: true,
        message: 'User has been signed up',
        data: { access_token, refresh_token },
      };
    } catch (error: unknown) {
      this.logger.error(`Processing sign up failed`);
      return serverErrorResponse(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public GenerateToken(user: User): Promise<string[]> {
    this.logger.debug(`Processing generation tokens for email: ${user.email}`);

    const { password, ...rest } = user;
    return Promise.all([
      this.jwtService.signAsync(rest, {
        expiresIn: +this.configService.getOrThrow('env.expiresInAccess'),
      }),
      this.jwtService.signAsync(rest, {
        expiresIn: +this.configService.getOrThrow('env.expiresInRefresh'),
      }),
    ]);
  }

  private async Validate(
    email: string,
    password: string,
  ): Promise<ServiceResponse<User>> {
    this.logger.debug('Processing validate user');

    const user = await this.userService.FindByEmail(email);

    if (
      user.succeeded &&
      (await bcrypt.compare(password, user.data.password))
    ) {
      return user;
    }

    return {
      succeeded: false,
      message: 'Invalid email or password',
      statusCode: HttpStatus.UNAUTHORIZED,
    };
  }
}
