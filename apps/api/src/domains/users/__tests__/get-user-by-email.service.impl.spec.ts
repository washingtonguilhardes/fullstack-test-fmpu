import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { GetUserByEmailServiceImpl } from '../application/get-user-by-email.service.impl';
import { EmailImpl, HashedPasswordImpl, UserImpl } from '../domain';
import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';
import { ApplicationException } from '@/shared/exceptions/application.exception';

describe('GetUserByEmailServiceImpl', () => {
  let service: GetUserByEmailServiceImpl;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new GetUserByEmailServiceImpl(mockUserRepository);
  });

  describe('execute', () => {
    it('should return user when found', async () => {
      const email = new EmailImpl('test@example.com');
      const mockUserData = {
        _id: 'user-id-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUserData);

      const result = await service.execute(email);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toBeInstanceOf(UserImpl);
      expect(result?.getId()).toBe('user-id-123');
      expect(result?.getEmail().getValue()).toBe('test@example.com');
      expect(result?.getFirstName()).toBe('John');
      expect(result?.getLastName()).toBe('Doe');
    });

    it('should return null when user not found', async () => {
      const email = new EmailImpl('nonexistent@example.com');
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await service.execute(email);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });

    it('should validate email before querying', async () => {
      expect(() => new EmailImpl('invalid-email')).toThrow(
        ApplicationException,
      );
    });

    it('should handle repository errors', async () => {
      const email = new EmailImpl('test@example.com');
      const error = new Error('Database connection failed');
      mockUserRepository.findByEmail.mockRejectedValue(error);

      await expect(service.execute(email)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should create user with correct domain objects', async () => {
      const email = new EmailImpl('test@example.com');
      const mockUserData = {
        _id: 'user-id-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUserData);

      const result = await service.execute(email);

      expect(result).toBeInstanceOf(UserImpl);
      expect(result?.getEmail()).toBeInstanceOf(EmailImpl);
      expect(result?.getPassword()).toBeInstanceOf(HashedPasswordImpl);
      expect(result?.getEmail().getValue()).toBe('test@example.com');
      expect(result?.getFirstName()).toBe('Jane');
      expect(result?.getLastName()).toBe('Smith');
    });

    it('should handle different email formats', async () => {
      const email = new EmailImpl('user.name+tag@domain.co.uk');
      const mockUserData = {
        _id: 'user-id-123',
        email: 'user.name+tag@domain.co.uk',
        passwordHash: 'hashed-password',
        firstName: 'User',
        lastName: 'Name',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUserData);

      const result = await service.execute(email);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'user.name+tag@domain.co.uk',
      );
      expect(result?.getEmail().getValue()).toBe('user.name+tag@domain.co.uk');
    });
  });
});
