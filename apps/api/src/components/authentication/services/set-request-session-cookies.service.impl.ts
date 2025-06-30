import { Response } from 'express';

import { ApplicationException } from '@driveapp/core/exceptions';

import { ISetRequestCookiesService } from './set-request-session-cookies.service';

export class SetRequestCookiesServiceImpl implements ISetRequestCookiesService {
  execute(res: Response, accessToken: string, refreshToken: string): Response {
    if (!res) {
      throw ApplicationException.parameterNotFound(
        'res',
        `Expected a response object but received ${typeof res}`,
      );
    }
    res.cookie('DriveappSessionId', accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      path: '/',
    });
    res.cookie('DriveappRefreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      path: '/',
    });
    res.header('Authorization', accessToken);
    res.header('x-driveapp-refresh-token', refreshToken);
    return res;
  }
}
