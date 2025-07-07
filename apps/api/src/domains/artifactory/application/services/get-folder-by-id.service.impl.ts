import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';
import { HttpStatus } from '@nestjs/common';

import { Folder, FolderFactory } from '../../domain';
import { GetFolderByIdService } from '../../interfaces/get-folder-by-id.service';

export class GetFolderByIdServiceImpl implements GetFolderByIdService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(id: string): Promise<Folder | null> {
    try {
      const entity = await this.artifactoryRepository.findById(id);

      if (!entity) {
        return null;
      }

      // Ensure it's a folder
      if (entity.type !== ArtifactoryType.FOLDER) {
        throw new ApplicationException(
          `Entity with ID ${id} is not a folder`,
          'INVALID_ENTITY_TYPE',
          HttpStatus.BAD_REQUEST,
        );
      }

      return FolderFactory.fromEntity(entity);
    } catch (error) {
      if (error instanceof ApplicationException) {
        throw error;
      }

      throw ApplicationException.internalExecutionError(
        'Get folder by ID',
        `Error retrieving folder with ID ${id}`,
      ).exception(error);
    }
  }
}
