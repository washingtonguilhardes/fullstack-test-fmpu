import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Response } from 'express';
import { SetTokenCookieServiceImpl } from '../application/token-cookie.service.impl';

describe('SetTokenCookieServiceImpl', () => {
  let service: SetTokenCookieServiceImpl;
  let mockResponse: jest.Mocked<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SetTokenCookieServiceImpl();
    mockResponse = {
      cookie: jest.fn(),
    } as any;
  });

  describe('execute', () => {
    it('should set cookie with correct parameters', () => {
      const token = 'test.jwt.token';

      service.execute(mockResponse, token);

      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 1000 * 60 * 60, // 1 hour
      });
    });

    it('should set cookie with different token', () => {
      const token = 'another.jwt.token';

      service.execute(mockResponse, token);

      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 1000 * 60 * 60, // 1 hour
      });
    });

    it('should set cookie with empty token', () => {
      const token = '';

      service.execute(mockResponse, token);

      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 1000 * 60 * 60, // 1 hour
      });
    });
  });
});
