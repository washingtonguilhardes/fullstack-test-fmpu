import { CreateNewFileDto } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { User } from '@/domains/users';
import { ApplicationException, ChecksumService } from '@/shared';
import { Injectable } from '@nestjs/common';

import { File, FileFactory, Path, PathFactory } from '../../domain';
import {
  CreateNewFileService,
  GetFolderByIdService,
  RemoveFileService,
  StoreFileUsecase,
} from '../../interfaces';
import { StorageFileAdapter } from '../../interfaces/storage-file-adapter';

@Injectable()
export class StoreFileUsecaseImpl implements StoreFileUsecase {
  constructor(
    private readonly storageFileAdapter: StorageFileAdapter,
    private readonly createNewFileService: CreateNewFileService,
    private readonly removeFileService: RemoveFileService,
    private readonly getFolderByIdService: GetFolderByIdService,
    private readonly checksumService: ChecksumService,
  ) {}

  async execute(owner: User, fileDto: CreateNewFileDto): Promise<File> {
    if (!fileDto.buffer) {
      throw ApplicationException.invalidParameter(
        'file.buffer',
        'File buffer is required to store a file',
      );
    }

    let parentPath: Path = PathFactory.root(owner.getId());
    if (fileDto.parentId) {
      const parentFolder = await this.getFolderByIdService.execute(
        fileDto.parentId,
      );
      if (!parentFolder) {
        throw ApplicationException.objectNotFound(`Invalid folder target`);
      }
      parentPath = parentFolder.getPath();
    }

    const file = await this.createNewFileService.execute(
      FileFactory.fromDto({
        name: fileDto.name,
        size: fileDto.size,
        ownerId: owner.getId(),
        parentId: fileDto.parentId || null,
        checksum: this.checksumService.calculate(fileDto.buffer),
        mimeType: fileDto.mimeType,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      parentPath,
    );

    try {
      // Now let's store the file in the storage
      await this.storageFileAdapter.store(file, fileDto.buffer);
    } catch (error) {
      await this.removeFileService.execute(file);
      throw error;
    }

    return file;
  }
}
