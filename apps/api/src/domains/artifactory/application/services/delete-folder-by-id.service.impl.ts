import { ApplicationException, OwnershipValidationService } from '@/shared';

import { ResourceImpl } from '../../../../shared/security/domain/resource';
import { DeleteFileByIdService } from '../../interfaces/delete-file-by-id.service';
import { DeleteFolderByIdService } from '../../interfaces/delete-folder-by-id.service';
import { GetFolderByIdService } from '../../interfaces/get-folder-by-id.service';
import { ListFilesByPathService } from '../../interfaces/list-files-by-path.service';
import { ListFoldersByPathService } from '../../interfaces/list-folders-by-path.service';
import { RemoveFolderService } from '../../interfaces/remove-folder.service';

export class DeleteFolderByIdServiceImpl implements DeleteFolderByIdService {
  constructor(
    private readonly getFolderByIdService: GetFolderByIdService,
    private readonly listFilesByPathService: ListFilesByPathService,
    private readonly listFoldersByPathService: ListFoldersByPathService,
    private readonly deleteFileByIdService: DeleteFileByIdService,
    private readonly removeFolderService: RemoveFolderService,
    private readonly ownershipValidationService: OwnershipValidationService,
  ) {}

  async execute(folderId: string, ownerId: string): Promise<void> {
    // Get the folder and validate ownership
    const folder = await this.getFolderByIdService.execute(folderId);
    if (!folder) {
      throw ApplicationException.objectNotFound(
        `Folder with ID ${folderId} not found`,
      );
    }
    await this.ownershipValidationService.execute(
      new ResourceImpl([folder.getOwnerId()]),
      ownerId,
    );

    const files = await this.listFilesByPathService.execute(folder.getPath());
    for (const file of files) {
      await this.deleteFileByIdService.execute(file.getId(), ownerId);
    }

    const subfolders = await this.listFoldersByPathService.execute(
      folder.getPath(),
    );
    for (const subfolder of subfolders) {
      await this.execute(subfolder.getId(), ownerId);
    }

    await this.removeFolderService.execute(folder);
  }
}
