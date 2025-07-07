import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import {
  ArtifactoryRepository,
  ArtifactoryRepositoryRef,
} from '@driveapp/contracts/repositories/artifactory.repository';
import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { CreateNewFolderServiceImpl } from '../create-new-folder.service.impl';
import { FolderImpl } from '../../../domain/folder';
import { FolderDto } from '@driveapp/contracts/entities/artifactory/dtos/folder.dto';
import { ListFoldersByPathService } from '@/domains/artifactory/interfaces/list-folders-by-path.service';

describe('CreateNewFolderServiceImpl', () => {
  let service: CreateNewFolderServiceImpl;
  let mockArtifactoryRepository: jest.Mocked<ArtifactoryRepository>;
  let mockListFoldersByPathService: jest.Mocked<ListFoldersByPathService>;
  beforeEach(() => {
    mockArtifactoryRepository = {
      findByPath: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAllByUserIdAndPath: jest.fn(),
    } as any;
    mockListFoldersByPathService = {
      execute: jest.fn(),
    } as any;
    service = new CreateNewFolderServiceImpl(
      mockArtifactoryRepository,
      mockListFoldersByPathService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new folder successfully', async () => {
      // Arrange
      const userId = 'user123';
      const folderName = 'Test Folder';
      const parentId = 'parent123';

      const folderDto: FolderDto = {
        name: folderName,
        path: `${userId}/${folderName}`,
        ownerId: userId,
        parentId,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        artifactoryCount: 0,
      };

      const folder = new FolderImpl(folderDto);

      mockArtifactoryRepository.findByPath.mockResolvedValue(null);
      mockArtifactoryRepository.create.mockResolvedValue({
        _id: folderDto.id,
        name: folderDto.name,
        type: ArtifactoryType.FOLDER,
        path: folderDto.path,
        userId: folderDto.ownerId,
        parentId: folderDto.parentId,
        createdAt: folderDto.createdAt,
        updatedAt: folderDto.updatedAt,
      });

      // Act
      await service.execute(folder);

      // Assert
      expect(mockArtifactoryRepository.findByPath).toHaveBeenCalledWith(
        folderDto.path,
      );
      expect(mockArtifactoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: folderDto.name,
          type: ArtifactoryType.FOLDER,
          path: folderDto.path,
          userId: folderDto.ownerId,
          parentId: folderDto.parentId,
        }),
      );
    });

    it('should throw error if folder with same name already exists', async () => {
      // Arrange
      const userId = 'user123';
      const folderName = 'Test Folder';

      const folderDto: FolderDto = {
        name: folderName,
        path: `${userId}/${folderName}`,
        ownerId: userId,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        artifactoryCount: 0,
      };

      const folder = new FolderImpl(folderDto);

      mockArtifactoryRepository.findByPath.mockResolvedValue({
        _id: 'existing-id',
        name: folderName,
        type: ArtifactoryType.FOLDER,
        path: folderDto.path,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act & Assert
      await expect(service.execute(folder)).rejects.toThrow(
        `A folder with the name "${folderName}" already exists in this location`,
      );

      expect(mockArtifactoryRepository.findByPath).toHaveBeenCalledWith(
        folderDto.path,
      );
      expect(mockArtifactoryRepository.create).not.toHaveBeenCalled();
    });
  });
});
