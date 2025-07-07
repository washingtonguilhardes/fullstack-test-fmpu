import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';

import { Folder } from '../../domain';
import { RemoveFolderService } from '../../interfaces/remove-folder.service';

export class RemoveFolderServiceImpl implements RemoveFolderService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(folder: Folder): Promise<void> {
    try {
      await this.artifactoryRepository.delete([folder.getId()]);
    } catch (error) {
      throw ApplicationException.internalExecutionError(
        'Folder removal',
        `Error removing folder ${folder.getName()} with ID ${folder.getId()}`,
      ).exception(error);
    }
  }
}
