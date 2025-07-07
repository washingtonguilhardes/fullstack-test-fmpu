import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';
import { HttpStatus } from '@nestjs/common';

import { File, FileFactory } from '../../domain';
import { GetFileByIdService } from '../../interfaces/get-file-by-id.service';

export class GetFileByIdServiceImpl implements GetFileByIdService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(id: string): Promise<File | null> {
    try {
      const entity = await this.artifactoryRepository.findById(id);

      if (!entity) {
        return null;
      }

      // Ensure it's a file
      if (entity.type !== ArtifactoryType.FILE) {
        throw new ApplicationException(
          `Entity with ID ${id} is not a file`,
          'INVALID_ENTITY_TYPE',
          HttpStatus.BAD_REQUEST,
        );
      }

      return FileFactory.fromEntity(entity);
    } catch (error) {
      if (error instanceof ApplicationException) {
        throw error;
      }

      throw ApplicationException.internalExecutionError(
        'Get file by ID',
        `Error retrieving file with ID ${id}`,
      ).exception(error);
    }
  }
}
