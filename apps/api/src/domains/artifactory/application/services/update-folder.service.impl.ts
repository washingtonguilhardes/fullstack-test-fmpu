import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';

import { Folder } from '../../domain';
import { UpdateFolderService } from '../../interfaces/update-folder.service';

export class UpdateFolderServiceImpl implements UpdateFolderService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(folder: Folder): Promise<void> {
    try {
      folder.validate();

      await this.artifactoryRepository.update(
        folder.getId(),
        folder.toEntity(),
      );
    } catch (error) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw ApplicationException.internalExecutionError(
        'Folder update',
        'Failed to update folder',
      );
    }
  }
}
