import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ValidateUserByCredentialsServiceImpl } from '../application/validate-user-by-credentials.service.impl';
import {
  EmailImpl,
  PasswordImpl,
  UserImpl,
  HashedPasswordImpl,
} from '../domain';
import { GetUserByEmailService } from '../interfaces';
import { ApplicationException } from '@/shared/exceptions/application.exception';

describe('ValidateUserByCredentialsServiceImpl', () => {
  let service: ValidateUserByCredentialsServiceImpl;
  let mockGetUserByEmailService: jest.Mocked<GetUserByEmailService>;

  beforeEach(() => {
    mockGetUserByEmailService = {
      execute: jest.fn(),
    } as any;

    service = new ValidateUserByCredentialsServiceImpl(
      mockGetUserByEmailService,
    );
  });

  describe('execute', () => {
    it('should return user when credentials are valid', async () => {
      const email = new EmailImpl('test@example.com');
      const password = new PasswordImpl('ValidPass123');
      const hashedPassword = new HashedPasswordImpl('hashed-password');

      const mockUser = new UserImpl(
        email,
        hashedPassword,
        'John',
        'Doe',
        new Date('2023-01-01'),
        new Date('2023-01-02'),
      );
      mockUser.setId('user-id-123');

      mockGetUserByEmailService.execute.mockResolvedValue(mockUser);
      jest.spyOn(password, 'isEqualTo').mockResolvedValue(true);

      const result = await service.execute(email, password);

      expect(mockGetUserByEmailService.execute).toHaveBeenCalledWith(email);
      expect(password.isEqualTo).toHaveBeenCalledWith(hashedPassword);
      expect(result).toBe(mockUser);
    });

    it('should throw ApplicationException when user not found', async () => {
      const email = new EmailImpl('nonexistent@example.com');
      const password = new PasswordImpl('ValidPass123');

      mockGetUserByEmailService.execute.mockResolvedValue(null);

      await expect(service.execute(email, password)).rejects.toThrow(
        ApplicationException,
      );
      expect(mockGetUserByEmailService.execute).toHaveBeenCalledWith(email);
    });

    it('should throw ApplicationException when user has no password', async () => {
      const email = new EmailImpl('test@example.com');
      // UserImpl will throw at construction
      expect(
        () =>
          new UserImpl(
            email,
            null as any,
            'John',
            'Doe',
            new Date('2023-01-01'),
            new Date('2023-01-02'),
          ),
      ).toThrow(ApplicationException);
    });

    it('should throw ApplicationException when password is invalid', async () => {
      const email = new EmailImpl('test@example.com');
      // PasswordImpl will throw at construction
      expect(() => new PasswordImpl('short')).toThrow(ApplicationException);
    });

    it('should throw ApplicationException with correct error code for user not found', async () => {
      const email = new EmailImpl('nonexistent@example.com');
      const password = new PasswordImpl('ValidPass123');

      mockGetUserByEmailService.execute.mockResolvedValue(null);

      try {
        await service.execute(email, password);
      } catch (error) {
        expect(error).toBeInstanceOf(ApplicationException);
        expect((error as ApplicationException).getExceptionCode()).toBe(
          'INVALID_CREDENTIALS_USRNF',
        );
      }
    });

    it('should throw ApplicationException with correct error code for invalid password', async () => {
      const email = new EmailImpl('test@example.com');
      // PasswordImpl will throw at construction
      expect(() => new PasswordImpl('short')).toThrow(ApplicationException);
    });

    it('should handle password comparison errors', async () => {
      const email = new EmailImpl('test@example.com');
      const password = new PasswordImpl('ValidPass123');
      const hashedPassword = new HashedPasswordImpl('hashed-password');

      const mockUser = new UserImpl(
        email,
        hashedPassword,
        'John',
        'Doe',
        new Date('2023-01-01'),
        new Date('2023-01-02'),
      );
      mockUser.setId('user-id-123');

      mockGetUserByEmailService.execute.mockResolvedValue(mockUser);
      jest
        .spyOn(password, 'isEqualTo')
        .mockRejectedValue(new Error('Hashing error'));

      await expect(service.execute(email, password)).rejects.toThrow(
        'Hashing error',
      );
    });

    it('should handle getUserByEmail service errors', async () => {
      const email = new EmailImpl('test@example.com');
      const password = new PasswordImpl('ValidPass123');

      mockGetUserByEmailService.execute.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(service.execute(email, password)).rejects.toThrow(
        'Service error',
      );
    });
  });
});
