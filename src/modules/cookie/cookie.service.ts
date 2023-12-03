import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { token } from 'common/interfaces/Service/IAuthService';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  public setTokensToCookies(res: Response, token: token) {
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          +this.configService.getOrThrow('env.expiresInAccess') * 1000,
      ),
    });
    res.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          +this.configService.getOrThrow('env.expiresInRefresh') * 1000,
      ),
    });
  }
}
