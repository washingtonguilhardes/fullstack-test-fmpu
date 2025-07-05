import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ExecutionContext } from '@nestjs/common';

describe('AccessToken Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      cookies: {},
      headers: {},
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;
  });

  it('should extract token from cookies when available', () => {
    const token = 'cookie-token-123';
    mockRequest.cookies = { access_token: token };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe(token);
  });

  it('should extract token from authorization header when cookies not available', () => {
    const token = 'header-token-456';
    mockRequest.cookies = {};
    mockRequest.headers = { authorization: `Bearer ${token}` };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe(token);
  });

  it('should extract token from authorization header without Bearer prefix', () => {
    const token = 'header-token-789';
    mockRequest.cookies = {};
    mockRequest.headers = { authorization: token };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe('');
  });

  it('should return empty string when neither cookies nor authorization header available', () => {
    mockRequest.cookies = {};
    mockRequest.headers = {};

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe('');
  });

  it('should return empty string when authorization header is malformed', () => {
    mockRequest.cookies = {};
    mockRequest.headers = { authorization: 'malformed-header' };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe('');
  });

  it('should prioritize cookies over authorization header', () => {
    const cookieToken = 'cookie-token-priority';
    const headerToken = 'header-token-secondary';

    mockRequest.cookies = { access_token: cookieToken };
    mockRequest.headers = { authorization: `Bearer ${headerToken}` };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe(cookieToken);
  });

  it('should handle empty authorization header', () => {
    mockRequest.cookies = {};
    mockRequest.headers = { authorization: '' };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe('');
  });

  it('should handle undefined authorization header', () => {
    mockRequest.cookies = {};
    mockRequest.headers = { authorization: undefined };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe('');
  });

  it('should handle null authorization header', () => {
    mockRequest.cookies = {};
    mockRequest.headers = { authorization: null };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe('');
  });

  it('should handle authorization header with only Bearer prefix', () => {
    mockRequest.cookies = {};
    mockRequest.headers = { authorization: 'Bearer ' };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe('');
  });

  it('should handle authorization header with multiple spaces', () => {
    const token = 'token-with-spaces';
    mockRequest.cookies = {};
    mockRequest.headers = { authorization: `Bearer   ${token}` };

    const request = mockExecutionContext.switchToHttp().getRequest();
    const result = (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;

    expect(result).toBe('');
  });
});
