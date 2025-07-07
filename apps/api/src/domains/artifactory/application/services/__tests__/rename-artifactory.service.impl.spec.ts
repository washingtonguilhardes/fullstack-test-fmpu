import { ApplicationException } from '@/shared';

import { PathImpl } from '../../../domain/path';
import { RenameArtifactoryServiceImpl } from '../rename-artifactory.service.impl';

// Mock dependencies
const mockGetFileByIdService = {
  execute: jest.fn(),
};

const mockGetFolderByIdService = {
  execute: jest.fn(),
};

const mockListFilesByPathService = {
  execute: jest.fn(),
};

const mockListFoldersByPathService = {
  execute: jest.fn(),
};

const mockStorageFileAdapter = {
  store: jest.fn(),
  delete: jest.fn(),
  getTemporaryUrl: jest.fn(),
  move: jest.fn(),
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

describe('RenameArtifactoryServiceImpl', () => {
  let service: RenameArtifactoryServiceImpl;

  beforeEach(() => {
    service = new RenameArtifactoryServiceImpl(
      mockGetFileByIdService as any,
      mockGetFolderByIdService as any,
      mockListFilesByPathService as any,
      mockListFoldersByPathService as any,
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
    const newName = 'new-name.txt';
    const ownerId = 'user-789';

    it('should throw error when new name is empty', async () => {
      await expect(service.execute(artifactoryId, '', ownerId)).rejects.toThrow(
        ApplicationException,
      );

      await expect(
        service.execute(artifactoryId, '   ', ownerId),
      ).rejects.toThrow(ApplicationException);
    });

    it('should throw error when artifactory item not found', async () => {
      mockGetFileByIdService.execute.mockRejectedValue(new Error('Not found'));
      mockGetFolderByIdService.execute.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(
        service.execute(artifactoryId, newName, ownerId),
      ).rejects.toThrow(ApplicationException);
    });

    it('should rename a file successfully', async () => {
      const file = {
        getId: () => artifactoryId,
        getOwnerId: () => ownerId,
        getName: () => 'old-name.txt',
        getPath: () => new PathImpl('/user-789/folder/old-name.txt'),
        setName: jest.fn(),
        setPath: jest.fn(),
      } as any;

      const parentPath = new PathImpl('/user-789/folder');
      const newPath = new PathImpl('/user-789/folder/new-name.txt');

      mockGetFileByIdService.execute.mockResolvedValue(file);
      mockListFilesByPathService.execute.mockResolvedValue([]);
      mockUpdateFileService.execute.mockResolvedValue(undefined);
      mockStorageFileAdapter.move.mockResolvedValue(undefined);

      await service.execute(artifactoryId, newName, ownerId);

      expect(mockOwnershipValidationService.execute).toHaveBeenCalled();
      expect(file.setName).toHaveBeenCalledWith(newName);
      expect(file.setPath).toHaveBeenCalled();
      expect(mockUpdateFileService.execute).toHaveBeenCalledWith(file);
      expect(mockStorageFileAdapter.move).toHaveBeenCalled();
    });

    it('should throw error when file with new name already exists', async () => {
      const file = {
        getId: () => artifactoryId,
        getOwnerId: () => ownerId,
        getName: () => 'old-name.txt',
        getPath: () => new PathImpl('/user-789/folder/old-name.txt'),
        setName: jest.fn(),
        setPath: jest.fn(),
      } as any;

      const existingFile = {
        getId: () => 'existing-file-id',
        getName: () => newName,
      } as any;

      mockGetFileByIdService.execute.mockResolvedValue(file);
      mockListFilesByPathService.execute.mockResolvedValue([existingFile]);

      await expect(
        service.execute(artifactoryId, newName, ownerId),
      ).rejects.toThrow(ApplicationException);
    });

    it('should rename a folder successfully', async () => {
      const folder = {
        getId: () => artifactoryId,
        getOwnerId: () => ownerId,
        getName: () => 'old-folder',
        getPath: () => new PathImpl('/user-789/old-folder'),
        setName: jest.fn(),
        setPath: jest.fn(),
      } as any;

      mockGetFileByIdService.execute.mockRejectedValue(new Error('Not found'));
      mockGetFolderByIdService.execute.mockResolvedValue(folder);
      mockListFoldersByPathService.execute.mockResolvedValue([]);
      mockUpdateFolderService.execute.mockResolvedValue(undefined);

      await service.execute(artifactoryId, newName, ownerId);

      expect(mockOwnershipValidationService.execute).toHaveBeenCalled();
      expect(folder.setName).toHaveBeenCalledWith(newName);
      expect(folder.setPath).toHaveBeenCalled();
      expect(mockUpdateFolderService.execute).toHaveBeenCalledWith(folder);
    });

    it('should throw error when folder with new name already exists', async () => {
      const folder = {
        getId: () => artifactoryId,
        getOwnerId: () => ownerId,
        getName: () => 'old-folder',
        getPath: () => new PathImpl('/user-789/old-folder'),
        setName: jest.fn(),
        setPath: jest.fn(),
      } as any;

      const existingFolder = {
        getId: () => 'existing-folder-id',
        getName: () => newName,
      } as any;

      mockGetFileByIdService.execute.mockRejectedValue(new Error('Not found'));
      mockGetFolderByIdService.execute.mockResolvedValue(folder);
      mockListFoldersByPathService.execute.mockResolvedValue([existingFolder]);

      await expect(
        service.execute(artifactoryId, newName, ownerId),
      ).rejects.toThrow(ApplicationException);
    });

    it('should rollback file rename if storage move fails', async () => {
      const file = {
        getId: () => artifactoryId,
        getOwnerId: () => ownerId,
        getName: () => 'old-name.txt',
        getPath: () => new PathImpl('/user-789/folder/old-name.txt'),
        setName: jest.fn(),
        setPath: jest.fn(),
      } as any;

      mockGetFileByIdService.execute.mockResolvedValue(file);
      mockListFilesByPathService.execute.mockResolvedValue([]);
      mockUpdateFileService.execute.mockResolvedValue(undefined);
      mockStorageFileAdapter.move.mockRejectedValue(new Error('Storage error'));

      await expect(
        service.execute(artifactoryId, newName, ownerId),
      ).rejects.toThrow(ApplicationException);

      expect(mockUpdateFileService.execute).toHaveBeenCalledTimes(2); // Once for update, once for rollback
    });
  });
});
