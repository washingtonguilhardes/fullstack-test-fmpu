import { ApplicationException } from '@/shared';
import { ResourceImpl } from '@/shared/security/domain/resource';
import { OwnershipValidationService } from '@/shared/security/interfaces/ownership-validation.service';

import { File } from '../../domain';
import { DeleteFileByIdService } from '../../interfaces/delete-file-by-id.service';
import { GetFileByIdService } from '../../interfaces/get-file-by-id.service';
import { RemoveFileService } from '../../interfaces/remove-file.service';
import { StorageFileAdapter } from '../../interfaces/storage-file-adapter';

export class DeleteFileByIdServiceImpl implements DeleteFileByIdService {
  constructor(
    private readonly getFileByIdService: GetFileByIdService,
    private readonly removeFileService: RemoveFileService,
    private readonly storageFileAdapter: StorageFileAdapter,
    private readonly ownershipValidationService: OwnershipValidationService,
  ) {}

  async execute(fileId: string, ownerId: string): Promise<void> {
    // Get the file by ID
    const file = await this.getFileByIdService.execute(fileId);

    if (!file) {
      throw ApplicationException.objectNotFound(
        `File with ID ${fileId} not found`,
      );
    }

    // Validate ownership
    await this.ownershipValidationService.execute(
      new ResourceImpl([file.getOwnerId()]),
      ownerId,
    );

    try {
      await this.storageFileAdapter.delete(file.getPath());
      await this.removeFileService.execute(file);
    } catch (error) {
      throw ApplicationException.internalExecutionError(
        'File deletion',
        `Error deleting file ${file.getName()} with ID ${fileId}`,
      ).exception(error);
    }
  }
}
