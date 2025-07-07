import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryRepository } from '@driveapp/contracts/repositories/artifactory.repository';

import { File, FileFactory, FileImpl, Path, PathFactory } from '../../domain';
import { ListFilesByPathService } from '../../interfaces/list-files-by-path.service';

export class ListFilesByPathServiceImpl implements ListFilesByPathService {
  constructor(private readonly artifactoryRepository: ArtifactoryRepository) {}

  async execute(path: Path): Promise<File[]> {
    const entities = await this.artifactoryRepository.findAllByPath(
      path.getValue(),
    );

    return entities
      .filter((entity) => entity.type === ArtifactoryType.FILE)
      .map((entity) => FileFactory.fromEntity(entity));
  }
}
