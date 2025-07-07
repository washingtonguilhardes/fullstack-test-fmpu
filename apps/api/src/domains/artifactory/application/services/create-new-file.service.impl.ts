import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { ApplicationException } from '@/shared';

import { File, Path, PathFactory } from '../../domain';
import { CreateNewFileService } from '../../interfaces/create-new-file.service';
import { ListFilesByPathService } from '../../interfaces/list-files-by-path.service';

export class CreateNewFileServiceImpl implements CreateNewFileService {
  constructor(
    private readonly artifactoryRepository: ArtifactoryRepository,
    private readonly listFilesByPathService: ListFilesByPathService,
  ) {}

  async execute(file: File, parentPath: Path): Promise<File> {
    const filePath = PathFactory.fromName(file.getName()).join(parentPath);
    // maybe validate file without extension in order to avoid file with same name that a folder
    const existingFiles = await this.listFilesByPathService.execute(filePath);

    const existingFile = existingFiles.find((existingItem) =>
      existingItem.getPath().equals(filePath),
    );

    if (existingFile) {
      throw ApplicationException.noDuplicatedAllowed(
        `A file with the name "${file.getName()}" already exists under ${filePath.getRelativePath()}`,
      );
    }

    file.setPath(filePath);

    const fileEntity = file.toEntity();

    const now = new Date();
    fileEntity.createdAt = now;
    fileEntity.updatedAt = now;

    fileEntity.type = ArtifactoryType.FILE;

    console.log('fileEntity', fileEntity);

    try {
      const { _id = '' } = await this.artifactoryRepository.create(fileEntity);
      file.setId(_id);
      return file;
    } catch (error) {
      throw ApplicationException.internalExecutionError(
        'File creation',
        `Error creating file ${file.toJSON().name} in path ${filePath.getValue()}`,
      ).exception(error);
    }
  }
}
