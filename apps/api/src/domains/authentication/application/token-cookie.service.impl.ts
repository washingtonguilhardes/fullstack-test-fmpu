import { Response } from 'express';

export interface SetTokenCookieService {
  execute(res: Response, token: string): void;
}
export const SetTokenCookieServiceRef = Symbol('SetTokenCookieService');

export class SetTokenCookieServiceImpl implements SetTokenCookieService {
  execute(res: Response, token: string): void {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60, // 1 hour
    });
  }
}
