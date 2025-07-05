import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as jwt from 'jsonwebtoken';
import { ValidateTokenServiceImpl } from '../application/validate-token.service.impl';
import { ApplicationException } from '@/shared/exceptions/application.exception';

jest.mock('jsonwebtoken');

describe('ValidateTokenServiceImpl', () => {
  const jwtSecret = 'test-secret';
  let service: ValidateTokenServiceImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ValidateTokenServiceImpl(jwtSecret);
  });

  describe('constructor', () => {
    it('should throw if jwtSecret is missing', () => {
      expect(() => new ValidateTokenServiceImpl('')).toThrow(
        ApplicationException,
      );
    });

    it('should create service with valid secret', () => {
      expect(() => new ValidateTokenServiceImpl(jwtSecret)).not.toThrow();
    });
  });

  describe('execute', () => {
    it('should validate valid token successfully', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-id' });

      await expect(
        service.execute('valid.token.here'),
      ).resolves.toBeUndefined();

      expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', jwtSecret, {
        issuer: 'driveapp-api',
        audience: 'driveapp-users',
      });
    });

    it('should throw ApplicationException for empty token', async () => {
      await expect(service.execute('')).rejects.toThrow(ApplicationException);
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException for null token', async () => {
      await expect(service.execute(null as any)).rejects.toThrow(
        ApplicationException,
      );
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException for undefined token', async () => {
      await expect(service.execute(undefined as any)).rejects.toThrow(
        ApplicationException,
      );
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('should handle JsonWebTokenError', async () => {
      const jwtError = new jwt.JsonWebTokenError('JWT error');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw jwtError;
      });

      await expect(service.execute('invalid.token')).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should handle TokenExpiredError', async () => {
      const expiredError = new jwt.TokenExpiredError(
        'Token expired',
        new Date(),
      );
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw expiredError;
      });

      await expect(service.execute('expired.token')).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should handle NotBeforeError', async () => {
      const notBeforeError = new jwt.NotBeforeError(
        'Token not yet valid',
        new Date(),
      );
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw notBeforeError;
      });

      await expect(service.execute('not.valid.yet.token')).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should re-throw ApplicationException', async () => {
      const appException = new ApplicationException('Test error', 'TEST_ERROR');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw appException;
      });

      await expect(service.execute('invalid.token')).rejects.toThrow(
        appException,
      );
    });

    it('should handle other errors', async () => {
      const genericError = new Error('Generic error');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(service.execute('invalid.token')).rejects.toThrow(
        ApplicationException,
      );
    });
  });
});
