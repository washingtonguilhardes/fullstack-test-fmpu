import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { AuthenticationPayloadImpl } from '../domain/auth.domain.impl';
import { EmailImpl } from '@/domains/users/domain/email';
import { PasswordImpl } from '@/domains/users/domain/password';
import { ApplicationException } from '@/shared/exceptions/application.exception';

describe('AuthenticationPayloadImpl', () => {
  let validEmail: EmailImpl;
  let validPassword: PasswordImpl;

  beforeEach(() => {
    validEmail = new EmailImpl('test@example.com');
    validPassword = new PasswordImpl('ValidPass123');
  });

  describe('constructor', () => {
    it('should create authentication payload with valid data', () => {
      const payload = new AuthenticationPayloadImpl(validEmail, validPassword);

      expect(payload.getEmail()).toBe(validEmail);
      expect(payload.getPassword()).toBe(validPassword);
    });

    it('should throw ApplicationException for missing email', () => {
      expect(
        () => new AuthenticationPayloadImpl(null as any, validPassword),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for missing password', () => {
      expect(
        () => new AuthenticationPayloadImpl(validEmail, null as any),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for missing both email and password', () => {
      expect(
        () => new AuthenticationPayloadImpl(null as any, null as any),
      ).toThrow(ApplicationException);
    });
  });

  describe('getEmail', () => {
    it('should return the email', () => {
      const payload = new AuthenticationPayloadImpl(validEmail, validPassword);
      expect(payload.getEmail()).toBe(validEmail);
    });
  });

  describe('getPassword', () => {
    it('should return the password', () => {
      const payload = new AuthenticationPayloadImpl(validEmail, validPassword);
      expect(payload.getPassword()).toBe(validPassword);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON object', () => {
      const payload = new AuthenticationPayloadImpl(validEmail, validPassword);

      const json = payload.toJSON();

      expect(json).toEqual({
        email: validEmail,
        password: validPassword,
      });
    });
  });

  describe('validate', () => {
    it('should not throw for valid authentication payload', () => {
      const payload = new AuthenticationPayloadImpl(validEmail, validPassword);
      expect(() => payload.validate()).not.toThrow();
    });

    it('should throw ApplicationException when email validation fails', () => {
      const invalidEmail = new EmailImpl('test@example.com');
      jest.spyOn(invalidEmail, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid email', 'INVALID_EMAIL');
      });

      expect(
        () => new AuthenticationPayloadImpl(invalidEmail, validPassword),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException when password validation fails', () => {
      const invalidPassword = new PasswordImpl('ValidPass123');
      jest.spyOn(invalidPassword, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid password', 'INVALID_PASSWORD');
      });

      expect(
        () => new AuthenticationPayloadImpl(validEmail, invalidPassword),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException when both email and password validation fail', () => {
      const invalidEmail = new EmailImpl('test@example.com');
      const invalidPassword = new PasswordImpl('ValidPass123');

      jest.spyOn(invalidEmail, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid email', 'INVALID_EMAIL');
      });
      jest.spyOn(invalidPassword, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid password', 'INVALID_PASSWORD');
      });

      expect(
        () => new AuthenticationPayloadImpl(invalidEmail, invalidPassword),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for missing email and password', () => {
      const payload = new AuthenticationPayloadImpl(validEmail, validPassword);
      // Mock the email and password properties to simulate missing data
      Object.defineProperty(payload, 'email', { value: null });
      Object.defineProperty(payload, 'password', { value: null });

      expect(() => payload.validate()).toThrow(ApplicationException);
    });
  });
});
