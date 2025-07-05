import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { UserImpl } from '../domain/user';
import { EmailImpl } from '../domain/email';
import { HashedPasswordImpl } from '../domain/hashed-password';
import { ApplicationException } from '@/shared/exceptions/application.exception';

describe('UserImpl', () => {
  let validEmail: EmailImpl;
  let validHashedPassword: HashedPasswordImpl;
  let validDate: Date;

  beforeEach(() => {
    validEmail = new EmailImpl('test@example.com');
    validHashedPassword = new HashedPasswordImpl('$2b$10$hashedpassword');
    validDate = new Date('2023-01-01T00:00:00Z');
  });

  describe('constructor', () => {
    it('should create user with valid data', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );

      expect(user.getEmail()).toBe(validEmail);
      expect(user.getPassword()).toBe(validHashedPassword);
      expect(user.getFirstName()).toBe('John');
      expect(user.getLastName()).toBe('Doe');
      expect(user.getUpdatedAt()).toBeNull();
    });

    it('should throw ApplicationException for missing email', () => {
      expect(
        () =>
          new UserImpl(
            null as any,
            validHashedPassword,
            'John',
            'Doe',
            validDate,
            null,
          ),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for missing password', () => {
      expect(
        () =>
          new UserImpl(validEmail, null as any, 'John', 'Doe', validDate, null),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for invalid email', () => {
      const invalidEmail = new EmailImpl('test@example.com');
      // Mock the email validation to fail
      jest.spyOn(invalidEmail, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid email', 'INVALID_EMAIL');
      });

      expect(
        () =>
          new UserImpl(
            invalidEmail,
            validHashedPassword,
            'John',
            'Doe',
            validDate,
            null,
          ),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException for invalid password', () => {
      const invalidPassword = new HashedPasswordImpl('$2b$10$hashedpassword');
      // Mock the password validation to fail
      jest.spyOn(invalidPassword, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid password', 'INVALID_PASSWORD');
      });

      expect(
        () =>
          new UserImpl(
            validEmail,
            invalidPassword,
            'John',
            'Doe',
            validDate,
            null,
          ),
      ).toThrow(ApplicationException);
    });
  });

  describe('getId', () => {
    it('should return null when id is not set', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      expect(user.getId()).toBeNull();
    });

    it('should return the set id', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      user.setId('user123');
      expect(user.getId()).toBe('user123');
    });
  });

  describe('setId', () => {
    it('should set the user id', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      user.setId('user123');
      expect(user.getId()).toBe('user123');
    });
  });

  describe('getEmail', () => {
    it('should return the email', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      expect(user.getEmail()).toBe(validEmail);
    });
  });

  describe('setEmail', () => {
    it('should set the email', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      const newEmail = new EmailImpl('new@example.com');
      user.setEmail(newEmail);
      expect(user.getEmail()).toBe(newEmail);
    });
  });

  describe('getFirstName', () => {
    it('should return the first name', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      expect(user.getFirstName()).toBe('John');
    });
  });

  describe('setFirstName', () => {
    it('should set the first name', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      user.setFirstName('Jane');
      expect(user.getFirstName()).toBe('Jane');
    });
  });

  describe('getLastName', () => {
    it('should return the last name', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      expect(user.getLastName()).toBe('Doe');
    });
  });

  describe('setLastName', () => {
    it('should set the last name', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      user.setLastName('Smith');
      expect(user.getLastName()).toBe('Smith');
    });
  });

  describe('getUsername', () => {
    it('should return the email value as username', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      expect(user.getUsername()).toBe('test@example.com');
    });
  });

  describe('getPassword', () => {
    it('should return the hashed password', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      expect(user.getPassword()).toBe(validHashedPassword);
    });
  });

  describe('getUpdatedAt', () => {
    it('should return null when updatedAt is not set', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      expect(user.getUpdatedAt()).toBeNull();
    });

    it('should return the set updatedAt', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        validDate,
      );
      expect(user.getUpdatedAt()).toBe(validDate);
    });
  });

  describe('setUpdatedAt', () => {
    it('should set the updatedAt', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      const newDate = new Date('2023-02-01T00:00:00Z');
      user.setUpdatedAt(newDate);
      expect(user.getUpdatedAt()).toBe(newDate);
    });
  });

  describe('toJSON', () => {
    it('should return user data as JSON object', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      user.setId('user123');

      const json = user.toJSON();
      expect(json).toEqual({
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: validDate,
        updatedAt: null,
      });
    });
  });

  describe('toEntity', () => {
    it('should convert user to entity format', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      user.setId('user123');

      const entity = user.toEntity();
      expect(entity).toEqual({
        _id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: '$2b$10$hashedpassword',
        createdAt: validDate,
        updatedAt: null,
      });
    });
  });

  describe('validate', () => {
    it('should not throw for valid user data', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      expect(() => user.validate()).not.toThrow();
    });

    it('should throw ApplicationException for missing email and password', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );
      // Mock the email and password properties to simulate missing data
      Object.defineProperty(user, 'email', { value: null });
      Object.defineProperty(user, 'password', { value: null });

      expect(() => user.validate()).toThrow(ApplicationException);
    });

    it('should throw ApplicationException with multiple validation errors', () => {
      const user = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        validDate,
        null,
      );

      // Mock both email and password validation to fail
      jest.spyOn(validEmail, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid email', 'INVALID_EMAIL');
      });
      jest.spyOn(validHashedPassword, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid password', 'INVALID_PASSWORD');
      });

      expect(() => user.validate()).toThrow(ApplicationException);
    });
  });
});
