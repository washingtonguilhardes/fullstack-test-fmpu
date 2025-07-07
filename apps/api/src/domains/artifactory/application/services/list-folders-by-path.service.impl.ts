import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { Path } from '../../domain';
import { Folder, FolderFactory } from '../../domain/folder';
import { ListFoldersByPathService } from '../../interfaces/list-folders-by-path.service';

export class ListFoldersByPathServiceImpl implements ListFoldersByPathService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(path: Path): Promise<Folder[]> {
    const entities = await this.artifactoryRepository.findAllByPath(
      path.getValue(),
    );

    return entities
      .filter((entity) => entity.type === ArtifactoryType.FOLDER)
      .map((entity) => FolderFactory.fromEntity(entity));
  }
}
