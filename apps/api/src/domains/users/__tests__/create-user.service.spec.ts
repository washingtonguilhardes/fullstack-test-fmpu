import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { CreateUserServiceImpl } from '../application/create-user.service';
import { EmailImpl } from '../domain/email';
import { PasswordImpl } from '../domain/password';
import { HashedPasswordImpl } from '../domain/hashed-password';
import { UserImpl } from '../domain/user';
import { ApplicationException } from '@/shared/exceptions/application.exception';

// Mock the interfaces
const mockUserRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as any;

const mockValidateUserService = {
  execute: jest.fn(),
} as any;

describe('CreateUserServiceImpl', () => {
  let createUserService: CreateUserServiceImpl;
  let validEmail: EmailImpl;
  let validPassword: PasswordImpl;
  let validHashedPassword: HashedPasswordImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    createUserService = new CreateUserServiceImpl(
      mockUserRepository as any,
      mockValidateUserService as any,
    );
    validEmail = new EmailImpl('test@example.com');
    validPassword = new PasswordImpl('ValidPass123');
    validHashedPassword = new HashedPasswordImpl('$2b$10$hashedpassword');
  });

  describe('execute', () => {
    it('should create user successfully', async () => {
      // Mock password hashing
      jest.spyOn(validPassword, 'hash').mockResolvedValue(validHashedPassword);

      // Mock user validation
      mockValidateUserService.execute.mockResolvedValue(undefined);

      // Mock repository create
      mockUserRepository.create.mockResolvedValue({ _id: 'user123' });

      const result = await createUserService.execute(
        validEmail,
        validPassword,
        'John',
        'Doe',
      );

      expect(validPassword.hash).toHaveBeenCalled();
      expect(mockValidateUserService.execute).toHaveBeenCalledWith(
        expect.any(UserImpl),
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: '$2b$10$hashedpassword',
        createdAt: expect.any(Date),
      });
      expect(result).toBeInstanceOf(UserImpl);
      expect(result.getId()).toBe('user123');
      expect(result.getEmail()).toBe(validEmail);
      expect(result.getFirstName()).toBe('John');
      expect(result.getLastName()).toBe('Doe');
    });

    it('should throw ApplicationException when password hashing fails', async () => {
      const mockError = new Error('Hashing failed');
      jest.spyOn(validPassword, 'hash').mockRejectedValue(mockError);

      await expect(
        createUserService.execute(validEmail, validPassword, 'John', 'Doe'),
      ).rejects.toThrow(ApplicationException);

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException when user validation fails', async () => {
      jest.spyOn(validPassword, 'hash').mockResolvedValue(validHashedPassword);

      const validationError = new ApplicationException(
        'User validation failed',
        'VALIDATION_ERROR',
      );
      mockValidateUserService.execute.mockRejectedValue(validationError);

      await expect(
        createUserService.execute(validEmail, validPassword, 'John', 'Doe'),
      ).rejects.toThrow(ApplicationException);

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException when repository create fails', async () => {
      jest.spyOn(validPassword, 'hash').mockResolvedValue(validHashedPassword);
      mockValidateUserService.execute.mockResolvedValue(undefined);

      const repositoryError = new Error('Database error');
      mockUserRepository.create.mockRejectedValue(repositoryError);

      await expect(
        createUserService.execute(validEmail, validPassword, 'John', 'Doe'),
      ).rejects.toThrow(ApplicationException);

      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should create user with correct data structure', async () => {
      jest.spyOn(validPassword, 'hash').mockResolvedValue(validHashedPassword);
      mockValidateUserService.execute.mockResolvedValue(undefined);
      mockUserRepository.create.mockResolvedValue({ _id: 'user123' });

      const result = await createUserService.execute(
        validEmail,
        validPassword,
        'Jane',
        'Smith',
      );

      const createdUser = mockValidateUserService.execute.mock
        .calls[0][0] as UserImpl;
      expect(createdUser).toBeInstanceOf(UserImpl);
      expect(createdUser.getEmail()).toBe(validEmail);
      expect(createdUser.getPassword()).toBe(validHashedPassword);
      expect(createdUser.getFirstName()).toBe('Jane');
      expect(createdUser.getLastName()).toBe('Smith');
      expect(createdUser.getUpdatedAt()).toBeNull();
      expect(result.getId()).toBe('user123');
    });
  });
});
