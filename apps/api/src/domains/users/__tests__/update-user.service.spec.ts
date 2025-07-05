import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { UpdateUserServiceImpl } from '../application/update-user.service';
import { EmailImpl, UserImpl, HashedPasswordImpl } from '../domain';
import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';
import { GetUserByIdService } from '../interfaces';
import { IValidateUserService } from '../application/validate-user.service';
import { ApplicationException } from '@/shared/exceptions/application.exception';

describe('UpdateUserServiceImpl', () => {
  let service: UpdateUserServiceImpl;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockGetUserByIdService: jest.Mocked<GetUserByIdService>;
  let mockValidateUserService: jest.Mocked<IValidateUserService>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockGetUserByIdService = {
      execute: jest.fn(),
    } as any;

    mockValidateUserService = {
      execute: jest.fn(),
    } as any;

    service = new UpdateUserServiceImpl(
      mockUserRepository,
      mockGetUserByIdService,
      mockValidateUserService,
    );
  });

  describe('execute', () => {
    const createMockUser = () => {
      const email = new EmailImpl('test@example.com');
      const hashedPassword = new HashedPasswordImpl('hashed-password');
      const user = new UserImpl(
        email,
        hashedPassword,
        'John',
        'Doe',
        new Date('2023-01-01'),
        new Date('2023-01-02'),
      );
      user.setId('user-id-123');
      return user;
    };

    it('should update user email successfully', async () => {
      const user = createMockUser();
      const newEmail = new EmailImpl('newemail@example.com');

      mockGetUserByIdService.execute.mockResolvedValue(user);
      mockValidateUserService.execute.mockResolvedValue();
      mockUserRepository.update.mockResolvedValue(user.toEntity());

      await service.execute('user-id-123', newEmail);

      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(user.getEmail().getValue()).toBe('newemail@example.com');
      expect(mockValidateUserService.execute).toHaveBeenCalledWith(user);
      expect(mockUserRepository.update).toHaveBeenCalledWith(user.toEntity());
    });

    it('should update user firstName successfully', async () => {
      const user = createMockUser();

      mockGetUserByIdService.execute.mockResolvedValue(user);
      mockValidateUserService.execute.mockResolvedValue();
      mockUserRepository.update.mockResolvedValue(user.toEntity());

      await service.execute('user-id-123', undefined, 'Jane');

      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(user.getFirstName()).toBe('Jane');
      expect(mockValidateUserService.execute).toHaveBeenCalledWith(user);
      expect(mockUserRepository.update).toHaveBeenCalledWith(user.toEntity());
    });

    it('should update user lastName successfully', async () => {
      const user = createMockUser();

      mockGetUserByIdService.execute.mockResolvedValue(user);
      mockValidateUserService.execute.mockResolvedValue();
      mockUserRepository.update.mockResolvedValue(user.toEntity());

      await service.execute('user-id-123', undefined, undefined, 'Smith');

      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(user.getLastName()).toBe('Smith');
      expect(mockValidateUserService.execute).toHaveBeenCalledWith(user);
      expect(mockUserRepository.update).toHaveBeenCalledWith(user.toEntity());
    });

    it('should update multiple fields successfully', async () => {
      const user = createMockUser();
      const newEmail = new EmailImpl('newemail@example.com');

      mockGetUserByIdService.execute.mockResolvedValue(user);
      mockValidateUserService.execute.mockResolvedValue();
      mockUserRepository.update.mockResolvedValue(user.toEntity());

      await service.execute('user-id-123', newEmail, 'Jane', 'Smith');

      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(user.getEmail().getValue()).toBe('newemail@example.com');
      expect(user.getFirstName()).toBe('Jane');
      expect(user.getLastName()).toBe('Smith');
      expect(mockValidateUserService.execute).toHaveBeenCalledWith(user);
      expect(mockUserRepository.update).toHaveBeenCalledWith(user.toEntity());
    });

    it('should not update when firstName is the same', async () => {
      const user = createMockUser();

      mockGetUserByIdService.execute.mockResolvedValue(user);

      await service.execute('user-id-123', undefined, 'John');

      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(user.getFirstName()).toBe('John'); // Already set
      expect(mockValidateUserService.execute).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should not update when lastName is the same', async () => {
      const user = createMockUser();

      mockGetUserByIdService.execute.mockResolvedValue(user);

      await service.execute('user-id-123', undefined, undefined, 'Doe');

      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(user.getLastName()).toBe('Doe'); // Already set
      expect(mockValidateUserService.execute).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should not update when no changes are provided', async () => {
      const user = createMockUser();

      mockGetUserByIdService.execute.mockResolvedValue(user);

      await service.execute('user-id-123');

      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(mockValidateUserService.execute).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException when user not found', async () => {
      mockGetUserByIdService.execute.mockResolvedValue(null);

      await expect(service.execute('non-existent-id')).rejects.toThrow(
        ApplicationException,
      );
      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(mockValidateUserService.execute).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ApplicationException when validation fails', async () => {
      const user = createMockUser();
      const newEmail = new EmailImpl('newemail@example.com');

      mockGetUserByIdService.execute.mockResolvedValue(user);
      mockValidateUserService.execute.mockRejectedValue(
        new ApplicationException('Validation failed', 'VALIDATION_ERROR'),
      );

      await expect(service.execute('user-id-123', newEmail)).rejects.toThrow(
        ApplicationException,
      );
      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(mockValidateUserService.execute).toHaveBeenCalledWith(user);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository update errors', async () => {
      const user = createMockUser();
      const newEmail = new EmailImpl('newemail@example.com');

      mockGetUserByIdService.execute.mockResolvedValue(user);
      mockValidateUserService.execute.mockResolvedValue();
      mockUserRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(service.execute('user-id-123', newEmail)).rejects.toThrow(
        'Database error',
      );
      expect(mockGetUserByIdService.execute).toHaveBeenCalledWith(
        'user-id-123',
      );
      expect(mockValidateUserService.execute).toHaveBeenCalledWith(user);
      expect(mockUserRepository.update).toHaveBeenCalledWith(user.toEntity());
    });

    it('should update updatedAt timestamp when changes are made', async () => {
      const user = createMockUser();
      const originalUpdatedAt = user.getUpdatedAt();
      const newEmail = new EmailImpl('newemail@example.com');

      mockGetUserByIdService.execute.mockResolvedValue(user);
      mockValidateUserService.execute.mockResolvedValue();
      mockUserRepository.update.mockResolvedValue(user.toEntity());

      await service.execute('user-id-123', newEmail);

      expect(user.getUpdatedAt()).not.toBe(originalUpdatedAt);
      expect(user.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should handle empty string parameters', async () => {
      const user = createMockUser();

      mockGetUserByIdService.execute.mockResolvedValue(user);
      mockValidateUserService.execute.mockResolvedValue();
      mockUserRepository.update.mockResolvedValue(user.toEntity());

      await service.execute('user-id-123', undefined, '', '');

      // The service does not update to empty strings, so names remain unchanged
      expect(user.getFirstName()).toBe('John');
      expect(user.getLastName()).toBe('Doe');
      expect(mockValidateUserService.execute).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
