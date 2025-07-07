import {
  ArtifactoryEntity,
  ArtifactoryType,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';

import { File, FileImpl, Path, PathFactory } from '../../../domain';
import { FileDto } from '@driveapp/contracts/entities/artifactory/dtos/file.dto';
import { ListFoldersByPathService } from '../../../interfaces/list-folders-by-path.service';
import { CreateNewFileServiceImpl } from '../create-new-file.service.impl';

describe('CreateNewFileServiceImpl', () => {
  let service: CreateNewFileServiceImpl;
  let artifactoryRepository: jest.Mocked<ArtifactoryRepository>;
  let listFoldersByPathService: jest.Mocked<ListFoldersByPathService>;
  let mockPath: jest.Mocked<Path>;

  beforeEach(() => {
    artifactoryRepository = {
      create: jest.fn(),
    } as any;

    listFoldersByPathService = {
      execute: jest.fn(),
    } as any;

    mockPath = {
      equals: jest.fn(),
      getValue: jest.fn(),
      join: jest.fn(),
    } as any;

    service = new CreateNewFileServiceImpl(
      artifactoryRepository,
      listFoldersByPathService,
    );

    // Mock PathFactory methods
    jest.spyOn(PathFactory, 'fromEntity').mockReturnValue(mockPath);
    jest.spyOn(PathFactory, 'fromName').mockReturnValue(mockPath);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockFileDto: FileDto = {
      name: 'test-file.pdf',
      ownerId: 'user123',
      checksum: 'abc123',
      mimeType: 'application/pdf',
      size: 1024,
    };

    let mockFile: File;

    beforeEach(() => {
      mockFile = new FileImpl(mockFileDto);
      mockPath.getValue.mockReturnValue('/user123/test-file.pdf');
    });

    it('should create a new file successfully', async () => {
      // Arrange
      listFoldersByPathService.execute.mockResolvedValue([]);
      const mockEntity: ArtifactoryEntity = {
        _id: 'file123',
        name: 'test-file.pdf',
        type: ArtifactoryType.FILE,
        userId: 'user123',
        path: '/user123/test-file.pdf',
        checksum: 'abc123',
        mimeType: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      artifactoryRepository.create.mockResolvedValue(mockEntity);

      // Act
      await service.execute(mockFile);

      // Assert
      expect(listFoldersByPathService.execute).toHaveBeenCalledWith(mockPath);
      expect(artifactoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test-file.pdf',
          type: ArtifactoryType.FILE,
          userId: 'user123',
          checksum: 'abc123',
          mimeType: 'application/pdf',
          size: 1024,
        }),
      );
      expect(mockFile.setId).toHaveBeenCalledWith('file123');
    });

    it('should throw error when file with same name already exists', async () => {
      // Arrange
      const existingFile = {
        getPath: () => mockPath,
      };
      listFoldersByPathService.execute.mockResolvedValue([existingFile as any]);
      mockPath.equals.mockReturnValue(true);

      // Act & Assert
      await expect(service.execute(mockFile)).rejects.toThrow(
        ApplicationException,
      );
      await expect(service.execute(mockFile)).rejects.toThrow(
        'A file with the name "test-file.pdf" already exists in this location',
      );
    });

    it('should throw error when repository creation fails', async () => {
      // Arrange
      listFoldersByPathService.execute.mockResolvedValue([]);
      const repositoryError = new Error('Database error');
      artifactoryRepository.create.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(service.execute(mockFile)).rejects.toThrow(
        ApplicationException,
      );
      await expect(service.execute(mockFile)).rejects.toThrow(
        'Error creating file test-file.pdf in path /user123/test-file.pdf',
      );
    });

    it('should validate file before creating', async () => {
      // Arrange
      listFoldersByPathService.execute.mockResolvedValue([]);
      const mockEntity: ArtifactoryEntity = {
        _id: 'file123',
        name: 'test-file.pdf',
        type: ArtifactoryType.FILE,
        userId: 'user123',
        path: '/user123/test-file.pdf',
        checksum: 'abc123',
        mimeType: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      artifactoryRepository.create.mockResolvedValue(mockEntity);

      // Act
      await service.execute(mockFile);

      // Assert
      expect(mockFile.validate).toHaveBeenCalled();
    });

    it('should set path on file before validation', async () => {
      // Arrange
      listFoldersByPathService.execute.mockResolvedValue([]);
      const mockEntity: ArtifactoryEntity = {
        _id: 'file123',
        name: 'test-file.pdf',
        type: ArtifactoryType.FILE,
        userId: 'user123',
        path: '/user123/test-file.pdf',
        checksum: 'abc123',
        mimeType: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      artifactoryRepository.create.mockResolvedValue(mockEntity);

      // Act
      await service.execute(mockFile);

      // Assert
      expect(mockFile.setPath).toHaveBeenCalledWith(mockPath);
    });
  });
});
