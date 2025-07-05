import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as jwt from 'jsonwebtoken';
import { DecodeTokenServiceImpl } from '../application/decode-token.service.impl';
import { ApplicationException } from '@/shared/exceptions/application.exception';

jest.mock('jsonwebtoken');

describe('DecodeTokenServiceImpl', () => {
  const jwtSecret = 'test-secret';
  let service: DecodeTokenServiceImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DecodeTokenServiceImpl(jwtSecret);
  });

  describe('constructor', () => {
    it('should throw if jwtSecret is missing', () => {
      expect(() => new DecodeTokenServiceImpl('')).toThrow(
        ApplicationException,
      );
    });

    it('should create service with valid secret', () => {
      expect(() => new DecodeTokenServiceImpl(jwtSecret)).not.toThrow();
    });
  });

  describe('execute', () => {
    it('should decode valid token successfully', async () => {
      const mockDecoded = {
        sub: 'user-id',
        username: 'user@example.com',
        iat: 1234567890,
      };
      (jwt.decode as jest.Mock).mockReturnValue(mockDecoded);

      const result = await service.execute('valid.token.here');

      expect(jwt.decode).toHaveBeenCalledWith('valid.token.here');
      expect(result).toBeInstanceOf(Object);
      expect(result.getSubject()).toBe('user-id');
      expect(result.getUsername()).toBe('user@example.com');
      expect(result.getIssuedAt()).toBe(1234567890);
    });

    it('should throw ApplicationException for empty token', async () => {
      await expect(service.execute('')).rejects.toThrow(ApplicationException);
      expect(jwt.decode).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException for null token', async () => {
      await expect(service.execute(null as any)).rejects.toThrow(
        ApplicationException,
      );
      expect(jwt.decode).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException for undefined token', async () => {
      await expect(service.execute(undefined as any)).rejects.toThrow(
        ApplicationException,
      );
      expect(jwt.decode).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException when jwt.decode returns null', async () => {
      (jwt.decode as jest.Mock).mockReturnValue(null);

      await expect(service.execute('invalid.token')).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should throw ApplicationException when jwt.decode returns non-object', async () => {
      (jwt.decode as jest.Mock).mockReturnValue('string-value');

      await expect(service.execute('invalid.token')).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should throw ApplicationException when jwt.decode returns object without required fields', async () => {
      (jwt.decode as jest.Mock).mockReturnValue({ someField: 'value' });

      await expect(service.execute('invalid.token')).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should handle JsonWebTokenError', async () => {
      const jwtError = new jwt.JsonWebTokenError('JWT error');
      (jwt.decode as jest.Mock).mockImplementation(() => {
        throw jwtError;
      });

      await expect(service.execute('invalid.token')).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should re-throw ApplicationException', async () => {
      const appException = new ApplicationException('Test error', 'TEST_ERROR');
      (jwt.decode as jest.Mock).mockImplementation(() => {
        throw appException;
      });

      await expect(service.execute('invalid.token')).rejects.toThrow(
        appException,
      );
    });

    it('should handle other errors', async () => {
      const genericError = new Error('Generic error');
      (jwt.decode as jest.Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(service.execute('invalid.token')).rejects.toThrow(
        ApplicationException,
      );
    });
  });
});
