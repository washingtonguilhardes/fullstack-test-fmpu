import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';

import { File, Folder } from '../../domain';
import { MoveFileService } from '../../interfaces/move-file.service';

export class MoveFileServiceImpl implements MoveFileService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(file: File, destinationFolder: Folder): Promise<void> {
    try {
      // Move the file to the new folder
      file.moveToFolder(destinationFolder);

      // Update the file in the repository
      await this.artifactoryRepository.update(file.getId(), {
        path: file.getPath().getValue(),
        parentId: destinationFolder.getId(),
        updatedAt: new Date(),
      });
    } catch (error) {
      throw ApplicationException.internalExecutionError(
        'File move',
        `Error moving file ${file.getName()} to folder ${destinationFolder.getName()}`,
      ).exception(error);
    }
  }
}
