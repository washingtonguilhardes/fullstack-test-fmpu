import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';

import { File } from '../../domain';
import { UpdateFileService } from '../../interfaces/update-file.service';

export class UpdateFileServiceImpl implements UpdateFileService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(file: File): Promise<void> {
    try {
      // Validate the file before updating
      file.validate();
      await this.artifactoryRepository.update(file.getId(), file.toEntity());
    } catch (error) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw ApplicationException.internalExecutionError(
        'File update',
        'Failed to update file',
      );
    }
  }
}
