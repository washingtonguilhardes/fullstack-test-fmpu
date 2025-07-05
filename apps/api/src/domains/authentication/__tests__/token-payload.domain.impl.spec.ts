import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { TokenPayloadImpl } from '../domain/token-payload.domain.impl';
import { ApplicationException } from '@/shared/exceptions/application.exception';

describe('TokenPayloadImpl', () => {
  const validSubject = 'user-id';
  const validUsername = 'user@example.com';
  const validIssuedAt = 1234567890;

  describe('constructor', () => {
    it('should create token payload with valid data', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
      );

      expect(payload.getSubject()).toBe(validSubject);
      expect(payload.getUsername()).toBe(validUsername);
      expect(payload.getIssuedAt()).toBe(validIssuedAt);
      expect(payload.getType()).toBe('access_token');
    });

    it('should create token payload with custom type', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
        'refresh_token',
      );

      expect(payload.getType()).toBe('refresh_token');
    });

    it('should throw ApplicationException for missing subject', () => {
      expect(
        () => new TokenPayloadImpl('', validUsername, validIssuedAt),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for null subject', () => {
      expect(
        () => new TokenPayloadImpl(null as any, validUsername, validIssuedAt),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for undefined subject', () => {
      expect(
        () =>
          new TokenPayloadImpl(undefined as any, validUsername, validIssuedAt),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for missing username', () => {
      expect(
        () => new TokenPayloadImpl(validSubject, '', validIssuedAt),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for null username', () => {
      expect(
        () => new TokenPayloadImpl(validSubject, null as any, validIssuedAt),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for undefined username', () => {
      expect(
        () =>
          new TokenPayloadImpl(validSubject, undefined as any, validIssuedAt),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for invalid issuedAt (zero)', () => {
      expect(
        () => new TokenPayloadImpl(validSubject, validUsername, 0),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for invalid issuedAt (negative)', () => {
      expect(
        () => new TokenPayloadImpl(validSubject, validUsername, -1),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for missing type', () => {
      expect(
        () =>
          new TokenPayloadImpl(validSubject, validUsername, validIssuedAt, ''),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for null type', () => {
      expect(
        () =>
          new TokenPayloadImpl(
            validSubject,
            validUsername,
            validIssuedAt,
            null as any,
          ),
      ).toThrow(ApplicationException);
    });

    it('should use default type when undefined is passed', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
        undefined as any,
      );
      expect(payload.getType()).toBe('access_token');
    });

    it('should throw ApplicationException with multiple validation errors', () => {
      expect(() => new TokenPayloadImpl('', '', -1, '')).toThrow(
        ApplicationException,
      );
    });
  });

  describe('getSubject', () => {
    it('should return the subject', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
      );
      expect(payload.getSubject()).toBe(validSubject);
    });
  });

  describe('getUsername', () => {
    it('should return the username', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
      );
      expect(payload.getUsername()).toBe(validUsername);
    });
  });

  describe('getIssuedAt', () => {
    it('should return the issuedAt timestamp', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
      );
      expect(payload.getIssuedAt()).toBe(validIssuedAt);
    });
  });

  describe('getType', () => {
    it('should return the default type', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
      );
      expect(payload.getType()).toBe('access_token');
    });

    it('should return the custom type', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
        'refresh_token',
      );
      expect(payload.getType()).toBe('refresh_token');
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON object', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
        'custom_type',
      );

      const json = payload.toJSON();

      expect(json).toEqual({
        sub: validSubject,
        username: validUsername,
        iat: validIssuedAt,
        type: 'custom_type',
      });
    });

    it('should return JSON with default type', () => {
      const payload = new TokenPayloadImpl(
        validSubject,
        validUsername,
        validIssuedAt,
      );

      const json = payload.toJSON();

      expect(json).toEqual({
        sub: validSubject,
        username: validUsername,
        iat: validIssuedAt,
        type: 'access_token',
      });
    });
  });
});
