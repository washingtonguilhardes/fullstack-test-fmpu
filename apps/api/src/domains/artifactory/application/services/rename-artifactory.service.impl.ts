import { ApplicationException, OwnershipValidationService } from '@/shared';

import { ResourceImpl } from '../../../../shared/security/domain/resource';
import { File, Folder, PathFactory } from '../../domain';
import { GetFileByIdService } from '../../interfaces/get-file-by-id.service';
import { GetFolderByIdService } from '../../interfaces/get-folder-by-id.service';
import { ListFilesByPathService } from '../../interfaces/list-files-by-path.service';
import { ListFoldersByPathService } from '../../interfaces/list-folders-by-path.service';
import { RenameArtifactoryService } from '../../interfaces/rename-artifactory.service';
import { StorageFileAdapter } from '../../interfaces/storage-file-adapter';
import { UpdateFileService } from '../../interfaces/update-file.service';
import { UpdateFolderService } from '../../interfaces/update-folder.service';

export class RenameArtifactoryServiceImpl implements RenameArtifactoryService {
  constructor(
    private readonly getFileByIdService: GetFileByIdService,
    private readonly getFolderByIdService: GetFolderByIdService,
    private readonly listFilesByPathService: ListFilesByPathService,
    private readonly listFoldersByPathService: ListFoldersByPathService,
    private readonly storageFileAdapter: StorageFileAdapter,
    private readonly ownershipValidationService: OwnershipValidationService,
    private readonly updateFileService: UpdateFileService,
    private readonly updateFolderService: UpdateFolderService,
  ) {}

  async execute(
    artifactoryId: string,
    newName: string,
    ownerId: string,
  ): Promise<void> {
    if (!newName || newName.trim() === '') {
      throw ApplicationException.invalidParameter(
        'newName',
        'New name is required and cannot be empty',
      );
    }

    let file: File | null = null;
    const folder: Folder | null = null;

    try {
      file = await this.getFileByIdService.execute(artifactoryId);
    } catch (error) {
      throw ApplicationException.objectNotFound(
        `Artifactory item with ID ${artifactoryId} not found`,
      );
    }

    if (file) {
      await this.renameFile(file, newName, ownerId);
    }
  }

  private async renameFile(
    file: File,
    newName: string,
    ownerId: string,
  ): Promise<void> {
    // Validate file ownership
    await this.ownershipValidationService.execute(
      new ResourceImpl([file.getOwnerId()]),
      ownerId,
    );

    const oldPath = file.getPath();
    const parentPath = oldPath.getParent();
    const newPath = PathFactory.fromName(newName).join(parentPath);

    // Check if a file with the new name already exists in the same folder
    const existingFiles = await this.listFilesByPathService.execute(parentPath);
    const existingFile = existingFiles.find(
      (existingItem) =>
        existingItem.getName() === newName &&
        existingItem.getId() !== file.getId(),
    );

    if (existingFile) {
      throw ApplicationException.noDuplicatedAllowed(
        `File with name ${newName} already exists in this folder`,
      );
    }

    const oldName = file.getName();
    file.setName(newName);
    file.setPath(newPath);

    await this.updateFileService.execute(file);

    try {
      await this.storageFileAdapter.move(oldPath, newPath);
    } catch (error) {
      file.setName(oldName);
      file.setPath(oldPath);
      await this.updateFileService.execute(file);
      throw ApplicationException.internalExecutionError(
        'Error renaming file in storage',
        error instanceof Error ? error.message : 'Unknown error',
      ).previousError(error as Error);
    }
  }
}
