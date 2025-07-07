import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { FolderDto } from '@driveapp/contracts/entities/artifactory/dtos/folder.dto';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException, OwnershipValidationService } from '@/shared';

import { Folder, FolderImpl, Path, PathFactory } from '../../domain';
import { GetFolderByIdService } from '../../interfaces';
import { CreateNewFolderService } from '../../interfaces/create-new-folder.service';
import { ListFoldersByPathService } from '../../interfaces/list-folders-by-path.service';

export class CreateNewFolderServiceImpl implements CreateNewFolderService {
  constructor(
    private readonly artifactoryRepository: ArtifactoryRepository,
    private readonly listFoldersByPathService: ListFoldersByPathService,
    private readonly ownershipValidationService: OwnershipValidationService,
    private readonly getFolderByIdService: GetFolderByIdService,
  ) {}

  private async getParentPath(folder: FolderDto): Promise<Path> {
    const parent = await this.getFolderByIdService.execute(folder.parentId);
    return parent.getPath();
  }

  private async getPath(folder: FolderDto): Promise<Path> {
    console.log({ folder });
    const path = PathFactory.fromName(folder.name);
    if (!folder.parentId) {
      return path.join(PathFactory.root(folder.ownerId));
    }
    const parentPath = await this.getParentPath(folder);
    return path.join(parentPath);
  }

  async execute(folderDto: FolderDto): Promise<Folder> {
    const path = await this.getPath(folderDto);

    const existingFolders = await this.listFoldersByPathService.execute(path);

    const existingFolder = existingFolders.find((existingFolder) =>
      existingFolder.getPath().equals(path),
    );

    if (existingFolder) {
      throw ApplicationException.noDuplicatedAllowed(
        `A folder with the name "${folderDto.name}" already exists in this location`,
      );
    }

    const folder: Folder = new FolderImpl(folderDto);

    folder.setPath(path);
    folder.validate();

    const folderEntity = folder.toEntity();

    const now = new Date();
    folderEntity.createdAt = now;
    folderEntity.updatedAt = now;

    folderEntity.type = ArtifactoryType.FOLDER;
    try {
      const { _id = '' } =
        await this.artifactoryRepository.create(folderEntity);
      folder.setId(_id);

      return folder;
    } catch (error) {
      throw ApplicationException.internalExecutionError(
        'Folder creation',
        `Error creating folder ${folder.getName()} in path ${path.getValue()}`,
      ).exception(error);
    }
  }
}
