import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { UserMongooseRepositoryImpl } from '../infrastructure/mongoose/user.repository.impl';
import { Model } from 'mongoose';
import { UserEntity } from '@driveapp/contracts/entities/users/user.entity';

describe('UserMongooseRepositoryImpl', () => {
  let repository: UserMongooseRepositoryImpl;
  let mockStatics: any;
  let mockModel: any;

  beforeEach(() => {
    mockStatics = {
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as any;
    // The model constructor returns a document
    mockModel = Object.assign(jest.fn() as any, mockStatics);
    repository = new UserMongooseRepositoryImpl(mockModel);
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      const mockUserData = {
        _id: 'user-id-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const mockQuery = {
        lean: jest.fn().mockReturnValue(mockUserData),
      };
      mockModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findByEmail('test@example.com');

      expect(mockModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toBe(mockUserData);
    });

    it('should return null when user not found', async () => {
      const mockQuery = {
        lean: jest.fn().mockReturnValue(null),
      };
      mockModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(mockModel.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const userEntity: UserEntity = {
        _id: 'user-id-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const mockUserDocument: any = {};
      mockUserDocument.save = jest.fn().mockResolvedValue(undefined);
      mockUserDocument.toObject = jest.fn().mockReturnValue(userEntity);

      mockModel.mockImplementation(() => mockUserDocument);

      const result = await repository.create(userEntity);

      expect(mockModel).toHaveBeenCalledWith(userEntity);
      expect(mockUserDocument.save).toHaveBeenCalled();
      expect(mockUserDocument.toObject).toHaveBeenCalled();
      expect(result).toBe(userEntity);
    });

    it('should handle save errors', async () => {
      const userEntity: UserEntity = {
        _id: 'user-id-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const mockUserDocument: any = {};
      mockUserDocument.save = jest
        .fn()
        .mockRejectedValue(new Error('Save failed'));

      mockModel.mockImplementation(() => mockUserDocument);

      await expect(repository.create(userEntity)).rejects.toThrow(
        'Save failed',
      );
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const userEntity: Partial<UserEntity> = {
        _id: 'user-id-123',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const mockUpdatedUser = {
        toObject: jest.fn().mockReturnValue({
          ...userEntity,
          email: 'test@example.com',
          passwordHash: 'hashed-password',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
        }),
      };

      mockModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

      const result = await repository.update(userEntity);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id-123',
        userEntity,
      );
      expect(mockUpdatedUser.toObject).toHaveBeenCalled();
      expect(result).toEqual({
        ...userEntity,
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });
    });

    it('should throw error when user not found for update', async () => {
      const userEntity: Partial<UserEntity> = {
        _id: 'non-existent-id',
        firstName: 'Jane',
      };

      mockModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(repository.update(userEntity)).rejects.toThrow(
        'Error updating user',
      );
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'non-existent-id',
        userEntity,
      );
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const mockDeletedUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
      };

      mockModel.findByIdAndDelete.mockResolvedValue(mockDeletedUser);

      await repository.delete('user-id-123');

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('user-id-123');
    });

    it('should throw error when user not found for deletion', async () => {
      mockModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(repository.delete('non-existent-id')).rejects.toThrow(
        'Error deleting user',
      );
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(
        'non-existent-id',
      );
    });
  });

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      const mockUserData = {
        _id: 'user-id-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const mockUserDocument = {
        toObject: jest.fn().mockReturnValue(mockUserData),
      };

      mockModel.findById.mockResolvedValue(mockUserDocument);

      const result = await repository.findById('user-id-123');

      expect(mockModel.findById).toHaveBeenCalledWith('user-id-123');
      expect(mockUserDocument.toObject).toHaveBeenCalled();
      expect(result).toBe(mockUserData);
    });

    it('should return null when user not found by id', async () => {
      mockModel.findById.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(mockModel.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });
});
