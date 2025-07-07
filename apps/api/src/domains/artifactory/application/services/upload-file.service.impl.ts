import { ApplicationException } from '@/shared';

import { File } from '../../domain';
import { StorageFileAdapter } from '../../interfaces/storage-file-adapter';
import { UploadFileService } from '../../interfaces/upload-file.service';

export class UploadFileServiceImpl implements UploadFileService {
  constructor(private readonly storageFileAdapter: StorageFileAdapter) {}

  async execute(file: File, buffer: Buffer): Promise<void> {
    try {
      await this.storageFileAdapter.store(file, buffer);
    } catch (error) {
      throw ApplicationException.internalExecutionError(
        'File upload',
        `Error uploading file ${file.getName()} to storage`,
      ).exception(error);
    }
  }
}
