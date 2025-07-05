import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { GetUserByIdServiceImpl } from '../application/get-user-by-id.service.impl';
import { EmailImpl, HashedPasswordImpl, UserImpl } from '../domain';
import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

describe('GetUserByIdServiceImpl', () => {
  let service: GetUserByIdServiceImpl;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new GetUserByIdServiceImpl(mockUserRepository);
  });

  describe('execute', () => {
    it('should return user when found', async () => {
      const mockUserData = {
        _id: 'user-id-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      mockUserRepository.findById.mockResolvedValue(mockUserData);

      const result = await service.execute('user-id-123');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-id-123');
      expect(result).toBeInstanceOf(UserImpl);
      expect(result?.getId()).toBe('user-id-123');
      expect(result?.getEmail().getValue()).toBe('test@example.com');
      expect(result?.getFirstName()).toBe('John');
      expect(result?.getLastName()).toBe('Doe');
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await service.execute('non-existent-id');

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockUserRepository.findById.mockRejectedValue(error);

      await expect(service.execute('user-id-123')).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-id-123');
    });

    it('should create user with correct domain objects', async () => {
      const mockUserData = {
        _id: 'user-id-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      mockUserRepository.findById.mockResolvedValue(mockUserData);

      const result = await service.execute('user-id-123');

      expect(result).toBeInstanceOf(UserImpl);
      expect(result?.getEmail()).toBeInstanceOf(EmailImpl);
      expect(result?.getPassword()).toBeInstanceOf(HashedPasswordImpl);
      expect(result?.getEmail().getValue()).toBe('test@example.com');
      expect(result?.getFirstName()).toBe('Jane');
      expect(result?.getLastName()).toBe('Smith');
    });

    it('should handle empty string id', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await service.execute('');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('');
      expect(result).toBeNull();
    });
  });
});
