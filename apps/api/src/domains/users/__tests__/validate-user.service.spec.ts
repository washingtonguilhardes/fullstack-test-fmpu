import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { ValidateUserServiceImpl } from '../application/validate-user.service';
import { EmailImpl } from '../domain/email';
import { HashedPasswordImpl } from '../domain/hashed-password';
import { UserImpl } from '../domain/user';
import { ApplicationException } from '@/shared/exceptions/application.exception';

// Mock the interfaces
const mockGetUserByEmailService = {
  execute: jest.fn(),
} as any;

describe('ValidateUserServiceImpl', () => {
  let validateUserService: ValidateUserServiceImpl;
  let validEmail: EmailImpl;
  let validHashedPassword: HashedPasswordImpl;
  let validUser: UserImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    validateUserService = new ValidateUserServiceImpl(
      mockGetUserByEmailService,
    );
    validEmail = new EmailImpl('test@example.com');
    validHashedPassword = new HashedPasswordImpl('$2b$10$hashedpassword');
    validUser = new UserImpl(
      validEmail,
      validHashedPassword,
      'John',
      'Doe',
      new Date(),
      null,
    );
    validUser.setId('user123');
  });

  describe('execute', () => {
    it('should validate user successfully when no existing user with same email', async () => {
      mockGetUserByEmailService.execute.mockResolvedValue(null);

      await expect(
        validateUserService.execute(validUser),
      ).resolves.toBeUndefined();

      expect(mockGetUserByEmailService.execute).toHaveBeenCalledWith(
        validEmail,
      );
    });

    it('should validate user successfully when existing user is the same user', async () => {
      const existingUser = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        new Date(),
        null,
      );
      existingUser.setId('user123');
      mockGetUserByEmailService.execute.mockResolvedValue(existingUser);

      await expect(
        validateUserService.execute(validUser),
      ).resolves.toBeUndefined();

      expect(mockGetUserByEmailService.execute).toHaveBeenCalledWith(
        validEmail,
      );
    });

    it('should throw ApplicationException when user has no email', async () => {
      const userWithoutEmail = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        new Date(),
        null,
      );
      // Mock the email property to simulate missing email
      Object.defineProperty(userWithoutEmail, 'email', { value: null });

      await expect(
        validateUserService.execute(userWithoutEmail),
      ).rejects.toThrow(ApplicationException);

      expect(mockGetUserByEmailService.execute).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException when user has no password', async () => {
      const userWithoutPassword = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        new Date(),
        null,
      );
      // Mock the password property to simulate missing password
      Object.defineProperty(userWithoutPassword, 'password', { value: null });

      await expect(
        validateUserService.execute(userWithoutPassword),
      ).rejects.toThrow(ApplicationException);

      expect(mockGetUserByEmailService.execute).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException when email validation fails', async () => {
      // Mock email to throw on validate BEFORE UserImpl is constructed
      const invalidEmail = new EmailImpl('test@example.com');
      jest.spyOn(invalidEmail, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid email', 'INVALID_EMAIL');
      });
      // The error will be thrown during UserImpl construction
      expect(
        () =>
          new UserImpl(
            invalidEmail,
            validHashedPassword,
            'John',
            'Doe',
            new Date(),
            null,
          ),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException when password validation fails', async () => {
      // Mock password to throw on validate BEFORE UserImpl is constructed
      const invalidPassword = new HashedPasswordImpl('$2b$10$hashedpassword');
      jest.spyOn(invalidPassword, 'validate').mockImplementation(() => {
        throw new ApplicationException('Invalid password', 'INVALID_PASSWORD');
      });
      // The error will be thrown during UserImpl construction
      expect(
        () =>
          new UserImpl(
            validEmail,
            invalidPassword,
            'John',
            'Doe',
            new Date(),
            null,
          ),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException when email already exists for different user', async () => {
      const existingUser = new UserImpl(
        validEmail,
        validHashedPassword,
        'Jane',
        'Smith',
        new Date(),
        null,
      );
      existingUser.setId('different-user-id');
      mockGetUserByEmailService.execute.mockResolvedValue(existingUser);

      await expect(validateUserService.execute(validUser)).rejects.toThrow(
        ApplicationException,
      );

      expect(mockGetUserByEmailService.execute).toHaveBeenCalledWith(
        validEmail,
      );
    });

    it('should handle string ID comparison correctly', async () => {
      const existingUser = new UserImpl(
        validEmail,
        validHashedPassword,
        'John',
        'Doe',
        new Date(),
        null,
      );
      existingUser.setId('user123'); // Same ID as validUser
      mockGetUserByEmailService.execute.mockResolvedValue(existingUser);

      await expect(
        validateUserService.execute(validUser),
      ).resolves.toBeUndefined();

      expect(mockGetUserByEmailService.execute).toHaveBeenCalledWith(
        validEmail,
      );
    });
  });
});
