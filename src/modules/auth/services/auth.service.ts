import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { serverErrorResponse } from 'common/errorHandlers/serverErrorResponse';
import { IAuthService, token } from 'common/interfaces/Service/IAuthService';
import { ServiceResponse } from 'common/types/ServiceResponse';

import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validate(user: User, password: string): Promise<ServiceResponse<void>> {
    this.logger.debug('Processing validate user');

    if (await bcrypt.compare(password, user.password)) {
      return { succeeded: true, message: 'User validated' };
    }

    return {
      succeeded: false,
      message: 'Invalid email or password',
    };
  }

  async hashPassword(password: string): Promise<string> {
    this.logger.debug('Processing hash password');
    return bcrypt.hash(password, 5);
  }

  async generateToken(user: User): Promise<ServiceResponse<token>> {
    this.logger.debug(`Processing generation tokens for email: ${user.email}`);

    try {
      const { password, ...rest } = user;

      const [access_token, refresh_token] = await Promise.all([
        this.signToken(rest, 'EXPIRES_IN_ACCESS'),
        this.signToken(rest, 'EXPIRES_IN_REFRESH'),
      ]);

      if (!access_token || !refresh_token) {
        return { succeeded: false, message: 'Generate token failed' };
      }

      return {
        succeeded: true,
        message: 'Token generated',
        data: { access_token, refresh_token },
      };
    } catch (error: unknown) {
      this.logger.error(error);
      return serverErrorResponse(error);
    }
  }

  private async signToken(
    payload: object | Buffer,
    expires: string,
  ): Promise<string> {
    this.logger.debug('Processing sign token');
    return this.jwtService.signAsync(payload, {
      expiresIn: +this.configService.getOrThrow(expires),
    });
  }
}
