import { ApplicationException } from '@/shared';

import { PathImpl } from '../../../domain/path';
import { MoveArtifactoryServiceImpl } from '../move-artifactory.service.impl';

// Mock dependencies
const mockGetFileByIdService = {
  execute: jest.fn(),
};

const mockGetFolderByIdService = {
  execute: jest.fn(),
};

const mockDeleteFileByIdService = {
  execute: jest.fn(),
};

const mockDeleteFolderByIdService = {
  execute: jest.fn(),
};

const mockRemoveFileService = {
  execute: jest.fn(),
};

const mockRemoveFolderService = {
  execute: jest.fn(),
};

const mockStorageFileAdapter = {
  store: jest.fn(),
  delete: jest.fn(),
  getTemporaryUrl: jest.fn(),
};

const mockOwnershipValidationService = {
  execute: jest.fn(),
};

const mockUpdateFileService = {
  execute: jest.fn(),
};

const mockUpdateFolderService = {
  execute: jest.fn(),
};

describe('MoveArtifactoryServiceImpl', () => {
  let service: MoveArtifactoryServiceImpl;

  beforeEach(() => {
    service = new MoveArtifactoryServiceImpl(
      mockGetFileByIdService as any,
      mockGetFolderByIdService as any,
      mockDeleteFileByIdService as any,
      mockDeleteFolderByIdService as any,
      mockRemoveFileService as any,
      mockRemoveFolderService as any,
      mockStorageFileAdapter as any,
      mockOwnershipValidationService as any,
      mockUpdateFileService as any,
      mockUpdateFolderService as any,
    );

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const artifactoryId = 'file-123';
    const targetFolderId = 'folder-456';
    const ownerId = 'user-789';

    it('should throw error when target folder not found', async () => {
      mockGetFolderByIdService.execute.mockResolvedValue(null);

      await expect(
        service.execute(artifactoryId, targetFolderId, ownerId),
      ).rejects.toThrow(ApplicationException);

      expect(mockGetFolderByIdService.execute).toHaveBeenCalledWith(
        targetFolderId,
      );
    });

    it('should throw error when artifactory item not found', async () => {
      const targetFolder = {
        getOwnerId: () => ownerId,
        getPath: () => new PathImpl('/target'),
      } as any;

      mockGetFolderByIdService.execute
        .mockResolvedValueOnce(targetFolder) // First call for target folder
        .mockRejectedValueOnce(new Error('Not found')); // Second call for artifactory item
      mockGetFileByIdService.execute.mockRejectedValue(new Error('Not found'));

      await expect(
        service.execute(artifactoryId, targetFolderId, ownerId),
      ).rejects.toThrow(ApplicationException);

      expect(mockGetFileByIdService.execute).toHaveBeenCalledWith(
        artifactoryId,
      );
    });

    it('should move a file successfully', async () => {
      const targetFolder = {
        getId: () => targetFolderId,
        getOwnerId: () => ownerId,
        getPath: () => new PathImpl('/target'),
      } as any;

      const file = {
        getId: () => artifactoryId,
        getOwnerId: () => ownerId,
        getName: () => 'test.txt',
        getPath: () => new PathImpl('/source/test.txt'),
        setPath: jest.fn(),
        moveToFolder: jest.fn(),
      } as any;

      mockGetFolderByIdService.execute.mockResolvedValue(targetFolder);
      mockGetFileByIdService.execute.mockResolvedValue(file);
      mockUpdateFileService.execute.mockResolvedValue(undefined);

      await service.execute(artifactoryId, targetFolderId, ownerId);

      expect(mockOwnershipValidationService.execute).toHaveBeenCalledTimes(2);
      expect(file.setPath).toHaveBeenCalled();
      expect(file.moveToFolder).toHaveBeenCalledWith(targetFolder);
      expect(mockUpdateFileService.execute).toHaveBeenCalledWith(file);
    });

    it('should move a folder successfully', async () => {
      const targetFolder = {
        getId: () => targetFolderId,
        getOwnerId: () => ownerId,
        getPath: () => new PathImpl('/target'),
      } as any;

      const folder = {
        getId: () => artifactoryId,
        getOwnerId: () => ownerId,
        getName: () => 'test-folder',
        getPath: () => new PathImpl('/source/test-folder'),
        setPath: jest.fn(),
        setParentId: jest.fn(),
      } as any;

      mockGetFolderByIdService.execute
        .mockResolvedValueOnce(targetFolder) // First call for target folder
        .mockResolvedValueOnce(folder); // Second call for artifactory item
      mockGetFileByIdService.execute.mockRejectedValue(new Error('Not found'));
      mockUpdateFolderService.execute.mockResolvedValue(undefined);

      await service.execute(artifactoryId, targetFolderId, ownerId);

      expect(mockOwnershipValidationService.execute).toHaveBeenCalledTimes(2);
      expect(folder.setPath).toHaveBeenCalled();
      expect(folder.setParentId).toHaveBeenCalledWith(targetFolderId);
      expect(mockUpdateFolderService.execute).toHaveBeenCalledWith(folder);
    });
  });
});
