import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { EmailImpl } from '../domain/email';
import { ApplicationException } from '@/shared/exceptions/application.exception';

describe('EmailImpl', () => {
  describe('constructor', () => {
    it('should create email with valid email address', () => {
      const email = new EmailImpl('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw ApplicationException for invalid email format', () => {
      expect(() => new EmailImpl('invalid-email')).toThrow(
        ApplicationException,
      );
      expect(() => new EmailImpl('test@')).toThrow(ApplicationException);
      expect(() => new EmailImpl('@example.com')).toThrow(ApplicationException);
      expect(() => new EmailImpl('test.example.com')).toThrow(
        ApplicationException,
      );
      expect(() => new EmailImpl('')).toThrow(ApplicationException);
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
        'test.email@subdomain.example.com',
      ];

      validEmails.forEach((emailStr) => {
        expect(() => new EmailImpl(emailStr)).not.toThrow();
      });
    });
  });

  describe('getValue', () => {
    it('should return the email string', () => {
      const email = new EmailImpl('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });
  });

  describe('validate', () => {
    it('should return true for valid email', () => {
      const email = new EmailImpl('test@example.com');
      expect(email.validate()).toBe(true);
    });

    it('should throw ApplicationException for invalid email', () => {
      const email = new EmailImpl('test@example.com');
      // Mock the email property to simulate invalid email
      Object.defineProperty(email, 'email', { value: 'invalid' });

      expect(() => email.validate()).toThrow(ApplicationException);
    });
  });

  describe('toString', () => {
    it('should return email string representation', () => {
      const email = new EmailImpl('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });
  });

  describe('equals', () => {
    it('should return true for same email addresses', () => {
      const email1 = new EmailImpl('test@example.com');
      const email2 = new EmailImpl('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different email addresses', () => {
      const email1 = new EmailImpl('test@example.com');
      const email2 = new EmailImpl('other@example.com');

      expect(email1.equals(email2)).toBe(false);
    });

    it('should return false for case-sensitive comparison', () => {
      const email1 = new EmailImpl('test@example.com');
      const email2 = new EmailImpl('TEST@example.com');

      expect(email1.equals(email2)).toBe(false);
    });
  });
});
