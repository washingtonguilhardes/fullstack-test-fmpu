import {
  ArtifactoryEntity,
  ArtifactoryType,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';

import {
  Artifactory,
  File,
  FileFactory,
  Folder,
  FolderFactory,
  Path,
  PathFactory,
} from '../../domain';
import { GetFolderByIdService } from '../../interfaces/get-folder-by-id.service';
import { ListArtifactoryByOwnerService } from '../../interfaces/list-artifactory-by-owner.service';

export class ListArtifactoryByOwnerServiceImpl
  implements ListArtifactoryByOwnerService
{
  constructor(
    private readonly artifactoryRepository: ArtifactoryRepository,
    private readonly getFolderByIdService: GetFolderByIdService,
  ) {}

  async execute(params: {
    ownerId: string;
    pathId?: string;
    artifactoryName?: string;
  }): Promise<{
    files: File[];
    folders: Folder[];
  }> {
    try {
      let targetPath: Path = PathFactory.root(params.ownerId);

      if (params.pathId) {
        const folder = await this.getFolderByIdService.execute(params.pathId);
        if (!folder) {
          throw ApplicationException.objectNotFound(
            `Folder with ID ${params.pathId} not found`,
          );
        }
        targetPath = folder.getPath();
      }

      let artifactoryEntities: ArtifactoryEntity[] = [];

      if (params.artifactoryName) {
        artifactoryEntities =
          await this.artifactoryRepository.findAllByUserIdPathAndName(
            params.ownerId,
            targetPath.getValue(),
            params.artifactoryName,
          );
      } else {
        artifactoryEntities =
          await this.artifactoryRepository.findAllByUserIdAndPath(
            params.ownerId,
            targetPath.getValue(),
          );
      }

      // Filter and map entities to domain objects
      const files = artifactoryEntities
        .filter((entity) => entity.type === ArtifactoryType.FILE)
        .map((entity) => FileFactory.fromEntity(entity));

      const folders = artifactoryEntities
        .filter((entity) => entity.type === ArtifactoryType.FOLDER)
        .map((entity) => FolderFactory.fromEntity(entity));

      return { files, folders };
    } catch (error) {
      throw ApplicationException.internalExecutionError(
        'List artifactory by owner',
        `Error listing artifactory items for owner ${params.ownerId}`,
      ).exception(error);
    }
  }
}
