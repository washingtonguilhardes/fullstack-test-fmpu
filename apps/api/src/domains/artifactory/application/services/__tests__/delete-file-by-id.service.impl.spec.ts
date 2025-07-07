import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ApplicationException } from '@/shared';
import { OwnershipValidationService } from '@/shared/security/interfaces/ownership-validation.service';

import {
  File,
  FileFactory,
  Path,
  PathFactory,
  PathImpl,
} from '../../../domain';
import { DeleteFileByIdServiceImpl } from '../delete-file-by-id.service.impl';
import { GetFileByIdService } from '../../../interfaces/get-file-by-id.service';
import { RemoveFileService } from '../../../interfaces/remove-file.service';
import { StorageFileAdapter } from '../../../interfaces/storage-file-adapter';

describe('DeleteFileByIdServiceImpl', () => {
  let service: DeleteFileByIdServiceImpl;
  let mockGetFileByIdService: jest.Mocked<GetFileByIdService>;
  let mockRemoveFileService: jest.Mocked<RemoveFileService>;
  let mockStorageFileAdapter: jest.Mocked<StorageFileAdapter>;
  let mockOwnershipValidationService: jest.Mocked<OwnershipValidationService>;

  const mockFile: File = FileFactory.fromDto({
    id: 'file123',
    name: 'test-file.jpg',
    ownerId: 'user123',
    parentId: 'folder123',
    createdAt: new Date(),
    updatedAt: new Date(),
    checksum: 'abc123',
    mimeType: 'image/jpeg',
    size: 1024,
    type: ArtifactoryType.FILE,
  });

  beforeEach(() => {
    mockGetFileByIdService = {
      execute: jest.fn(),
    };

    mockRemoveFileService = {
      execute: jest.fn(),
    };

    mockStorageFileAdapter = {
      store: jest.fn(),
      getTemporaryUrl: jest.fn(),
      delete: jest.fn(),
    };

    mockOwnershipValidationService = {
      execute: jest.fn(),
    };

    service = new DeleteFileByIdServiceImpl(
      mockGetFileByIdService,
      mockRemoveFileService,
      mockStorageFileAdapter,
      mockOwnershipValidationService,
    );

    // Set up the file path
    mockFile.setPath(new PathImpl('/user123/folder123/test-file.jpg'));
  });

  describe('execute', () => {
    it('should delete file successfully when user is owner', async () => {
      // Arrange
      const fileId = 'file123';
      const ownerId = 'user123';

      mockGetFileByIdService.execute.mockResolvedValue(mockFile);
      mockOwnershipValidationService.execute.mockResolvedValue();
      mockStorageFileAdapter.delete.mockResolvedValue(true);
      mockRemoveFileService.execute.mockResolvedValue();

      // Act
      await service.execute(fileId, ownerId);

      // Assert
      expect(mockGetFileByIdService.execute).toHaveBeenCalledWith(fileId);
      expect(mockOwnershipValidationService.execute).toHaveBeenCalled();
      expect(mockStorageFileAdapter.delete).toHaveBeenCalledWith(
        mockFile.getPath(),
      );
      expect(mockRemoveFileService.execute).toHaveBeenCalledWith(mockFile);
    });

    it('should throw error when file not found', async () => {
      // Arrange
      const fileId = 'nonexistent';
      const ownerId = 'user123';

      mockGetFileByIdService.execute.mockResolvedValue(null);

      // Act & Assert
      await expect(service.execute(fileId, ownerId)).rejects.toThrow(
        ApplicationException,
      );
      await expect(service.execute(fileId, ownerId)).rejects.toThrow(
        'File with ID nonexistent not found',
      );
    });

    it('should throw error when user is not owner', async () => {
      // Arrange
      const fileId = 'file123';
      const ownerId = 'user456'; // Different user

      mockGetFileByIdService.execute.mockResolvedValue(mockFile);
      mockOwnershipValidationService.execute.mockRejectedValue(
        new ApplicationException('Forbidden', 'FORBIDDEN', 403),
      );

      // Act & Assert
      await expect(service.execute(fileId, ownerId)).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should throw error when storage deletion fails', async () => {
      // Arrange
      const fileId = 'file123';
      const ownerId = 'user123';

      mockGetFileByIdService.execute.mockResolvedValue(mockFile);
      mockOwnershipValidationService.execute.mockResolvedValue();
      mockStorageFileAdapter.delete.mockRejectedValue(
        new Error('Storage error'),
      );

      // Act & Assert
      await expect(service.execute(fileId, ownerId)).rejects.toThrow(
        ApplicationException,
      );
    });

    it('should throw error when database deletion fails', async () => {
      // Arrange
      const fileId = 'file123';
      const ownerId = 'user123';

      mockGetFileByIdService.execute.mockResolvedValue(mockFile);
      mockOwnershipValidationService.execute.mockResolvedValue();
      mockStorageFileAdapter.delete.mockResolvedValue(true);
      mockRemoveFileService.execute.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(service.execute(fileId, ownerId)).rejects.toThrow(
        ApplicationException,
      );
    });
  });
});
