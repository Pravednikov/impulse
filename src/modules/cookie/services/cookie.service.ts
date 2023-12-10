import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { token } from 'common/interfaces/Service/IAuthService';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  public setTokensToCookies(res: Response, token: token): void {
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      expires: this.setExpiresDate('EXPIRES_IN_ACCESS'),
    });
    res.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      expires: this.setExpiresDate('EXPIRES_IN_REFRESH'),
    });
  }

  private setExpiresDate(expires: string): Date {
    return new Date(
      Date.now() + +this.configService.getOrThrow(expires) * 1000,
    );
  }
}
