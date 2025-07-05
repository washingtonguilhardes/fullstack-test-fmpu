import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import * as bcrypt from 'bcrypt';
import { PasswordImpl } from '../domain/password';
import { HashedPasswordImpl } from '../domain/hashed-password';
import { ApplicationException } from '@/shared/exceptions/application.exception';

// Mock bcrypt
jest.mock('bcrypt');

describe('PasswordImpl', () => {
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create password with valid password', () => {
      const password = new PasswordImpl('ValidPass123');
      expect(password.getValue()).toBe('ValidPass123');
    });

    it('should throw ApplicationException for empty password', () => {
      expect(() => new PasswordImpl('')).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for password too short', () => {
      expect(() => new PasswordImpl('Short1')).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for password too long', () => {
      expect(() => new PasswordImpl('ThisIsAVeryLongPassword123')).toThrow(
        ApplicationException,
      );
    });

    it('should throw ApplicationException for password without uppercase', () => {
      expect(() => new PasswordImpl('lowercase123')).toThrow(
        ApplicationException,
      );
    });

    it('should throw ApplicationException for password without lowercase', () => {
      expect(() => new PasswordImpl('UPPERCASE123')).toThrow(
        ApplicationException,
      );
    });

    it('should throw ApplicationException for password without number', () => {
      expect(() => new PasswordImpl('NoNumbers')).toThrow(ApplicationException);
    });

    it('should accept valid passwords', () => {
      const validPasswords = [
        'ValidPass123',
        'MyPassword1',
        'SecurePass9',
        'Test123Pass',
      ];

      validPasswords.forEach((pwd) => {
        expect(() => new PasswordImpl(pwd)).not.toThrow();
      });
    });
  });

  describe('getValue', () => {
    it('should return the raw password', () => {
      const password = new PasswordImpl('ValidPass123');
      expect(password.getValue()).toBe('ValidPass123');
    });
  });

  describe('validate', () => {
    it('should not throw for valid password', () => {
      const password = new PasswordImpl('ValidPass123');
      expect(() => password.validate()).not.toThrow();
    });

    it('should throw ApplicationException for invalid password', () => {
      const password = new PasswordImpl('ValidPass123');
      // Mock the rawPassword property to simulate invalid password
      Object.defineProperty(password, 'rawPassword', { value: 'invalid' });

      expect(() => password.validate()).toThrow(ApplicationException);
    });
  });

  describe('hash', () => {
    it('should hash password successfully', async () => {
      const mockSalt = 'mock-salt';
      const mockHash = 'mock-hashed-password';

      mockBcrypt.genSalt.mockResolvedValue(mockSalt as never);
      mockBcrypt.hash.mockResolvedValue(mockHash as never);

      const password = new PasswordImpl('ValidPass123');
      const hashedPassword = await password.hash();

      expect(mockBcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('ValidPass123', mockSalt);
      expect(hashedPassword).toBeInstanceOf(HashedPasswordImpl);
      expect(hashedPassword.getValue()).toBe(mockHash);
    });

    it('should throw ApplicationException when hashing fails', async () => {
      const mockError = new Error('Hashing failed');
      mockBcrypt.genSalt.mockRejectedValue(mockError);

      const password = new PasswordImpl('ValidPass123');

      await expect(password.hash()).rejects.toThrow(ApplicationException);
    });
  });

  describe('isEqualTo', () => {
    it('should return true for matching password', async () => {
      mockBcrypt.compare.mockResolvedValue(true as never);

      const password = new PasswordImpl('ValidPass123');
      const hashedPassword = new HashedPasswordImpl('hashed-password');

      const result = await password.isEqualTo(hashedPassword);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        'ValidPass123',
        'hashed-password',
      );
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      mockBcrypt.compare.mockResolvedValue(false as never);

      const password = new PasswordImpl('ValidPass123');
      const hashedPassword = new HashedPasswordImpl('hashed-password');

      const result = await password.isEqualTo(hashedPassword);

      expect(result).toBe(false);
    });

    it('should return false for empty password', async () => {
      const password = new PasswordImpl('ValidPass123');
      const hashedPassword = new HashedPasswordImpl('hashed-password');

      // Mock the rawPassword property to simulate empty password
      Object.defineProperty(password, 'rawPassword', { value: '' });

      const result = await password.isEqualTo(hashedPassword);

      expect(result).toBe(false);
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException when comparison fails', async () => {
      const mockError = new Error('Comparison failed');
      mockBcrypt.compare.mockRejectedValue(mockError);

      const password = new PasswordImpl('ValidPass123');
      const hashedPassword = new HashedPasswordImpl('hashed-password');

      await expect(password.isEqualTo(hashedPassword)).rejects.toThrow(
        ApplicationException,
      );
    });
  });

  describe('toJSON', () => {
    it('should return masked password', () => {
      const password = new PasswordImpl('ValidPass123');
      expect(password.toJSON()).toBe('********');
    });
  });

  describe('toString', () => {
    it('should return masked password', () => {
      const password = new PasswordImpl('ValidPass123');
      expect(password.toString()).toBe('********');
    });
  });
});
