import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { HashedPasswordImpl } from '../domain/hashed-password';
import { ApplicationException } from '@/shared/exceptions/application.exception';

describe('HashedPasswordImpl', () => {
  describe('constructor', () => {
    it('should create hashed password with valid hash', () => {
      const hashedPassword = new HashedPasswordImpl(
        '$2b$10$hashedpasswordstring',
      );
      expect(hashedPassword.getValue()).toBe('$2b$10$hashedpasswordstring');
    });

    it('should throw ApplicationException for empty hash', () => {
      expect(() => new HashedPasswordImpl('')).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for null hash', () => {
      expect(() => new HashedPasswordImpl(null as any)).toThrow(
        ApplicationException,
      );
    });

    it('should throw ApplicationException for undefined hash', () => {
      expect(() => new HashedPasswordImpl(undefined as any)).toThrow(
        ApplicationException,
      );
    });
  });

  describe('getValue', () => {
    it('should return the hashed password string', () => {
      const hash = '$2b$10$hashedpasswordstring';
      const hashedPassword = new HashedPasswordImpl(hash);
      expect(hashedPassword.getValue()).toBe(hash);
    });
  });

  describe('validate', () => {
    it('should not throw for valid hashed password', () => {
      const hashedPassword = new HashedPasswordImpl(
        '$2b$10$hashedpasswordstring',
      );
      expect(() => hashedPassword.validate()).not.toThrow();
    });

    it('should throw ApplicationException for invalid hashed password', () => {
      const hashedPassword = new HashedPasswordImpl(
        '$2b$10$hashedpasswordstring',
      );
      // Mock the hashedPassword property to simulate invalid hash
      Object.defineProperty(hashedPassword, 'hashedPassword', { value: '' });

      expect(() => hashedPassword.validate()).toThrow(ApplicationException);
    });
  });

  describe('toJSON', () => {
    it('should return masked hashed password', () => {
      const hashedPassword = new HashedPasswordImpl(
        '$2b$10$hashedpasswordstring',
      );
      expect(hashedPassword.toJSON()).toBe('************');
    });
  });
});
