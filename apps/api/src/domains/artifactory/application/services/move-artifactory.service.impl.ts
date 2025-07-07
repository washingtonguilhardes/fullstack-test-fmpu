import { ApplicationException, OwnershipValidationService } from '@/shared';

import { ResourceImpl } from '../../../../shared/security/domain/resource';
import { File, Folder, PathFactory } from '../../domain';
import { ListFilesByPathService } from '../../interfaces';
import { GetFileByIdService } from '../../interfaces/get-file-by-id.service';
import { GetFolderByIdService } from '../../interfaces/get-folder-by-id.service';
import { MoveArtifactoryService } from '../../interfaces/move-artifactory.service';
import { StorageFileAdapter } from '../../interfaces/storage-file-adapter';
import { UpdateFileService } from '../../interfaces/update-file.service';

export class MoveArtifactoryServiceImpl implements MoveArtifactoryService {
  constructor(
    private readonly getFileByIdService: GetFileByIdService,
    private readonly getFolderByIdService: GetFolderByIdService,
    private readonly listFilesByPathService: ListFilesByPathService,
    private readonly storageFileAdapter: StorageFileAdapter,
    private readonly ownershipValidationService: OwnershipValidationService,
    private readonly updateFileService: UpdateFileService,
  ) {}

  async execute(
    artifactoryId: string,
    targetFolderId: string,
    ownerId: string,
  ): Promise<void> {
    const targetFolder =
      await this.getFolderByIdService.execute(targetFolderId);
    if (!targetFolder) {
      throw ApplicationException.objectNotFound(
        `Target folder with ID ${targetFolderId} not found`,
      );
    }

    await this.ownershipValidationService.execute(
      new ResourceImpl([targetFolder.getOwnerId()]),
      ownerId,
    );

    let file: File | null = null;

    try {
      file = await this.getFileByIdService.execute(artifactoryId);
    } catch (error) {
      throw ApplicationException.objectNotFound(
        `Artifactory item with ID ${artifactoryId} not found`,
      );
    }

    if (file) {
      await this.moveFile(file, targetFolder, ownerId);
    }
  }

  private async moveFile(
    file: File,
    targetFolder: Folder,
    ownerId: string,
  ): Promise<void> {
    await this.ownershipValidationService.execute(
      new ResourceImpl([file.getOwnerId()]),
      ownerId,
    );

    const targetPath = targetFolder
      .getPath()
      .join(PathFactory.fromName(file.getName()));
    const sourcePath = file.getPath();
    const sourceParentId = file.getParentId();

    const existingFiles = await this.listFilesByPathService.execute(targetPath);
    const existingFile = existingFiles.find((existingItem) =>
      existingItem.getPath().equals(targetPath),
    );

    if (existingFile) {
      throw ApplicationException.objectNotFound(
        `File with name ${file.getName()} already exists in the target folder`,
      );
    }
    file.setPath(targetPath);
    file.setParentId(targetFolder.getId());

    await this.updateFileService.execute(file);

    try {
      await this.storageFileAdapter.move(sourcePath, targetPath);
    } catch (error) {
      file.setParentId(sourceParentId);
      file.setPath(sourcePath);
      await this.updateFileService.execute(file);
      throw ApplicationException.internalExecutionError(
        'Error moving file',
        error instanceof Error ? error.message : 'Unknown error',
      ).previousError(error as Error);
    }
  }
}
