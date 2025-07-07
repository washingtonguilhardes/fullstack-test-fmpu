import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';

import { File } from '../../domain';
import { RemoveFileService } from '../../interfaces/remove-file.service';

export class RemoveFileServiceImpl implements RemoveFileService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(file: File): Promise<void> {
    try {
      await this.artifactoryRepository.delete([file.getId()]);
    } catch (error) {
      throw ApplicationException.internalExecutionError(
        'File removal',
        `Error removing file ${file.getName()} with ID ${file.getId()}`,
      ).exception(error);
    }
  }
}
