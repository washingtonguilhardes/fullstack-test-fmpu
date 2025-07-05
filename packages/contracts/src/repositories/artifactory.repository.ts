import { ArtifactoryEntity } from '../entities/artifactory/artifactory.entity';

export interface IArtifactoryRepository {
  findById(id: string): Promise<ArtifactoryEntity | null>;
  create(artifactory: ArtifactoryEntity): Promise<ArtifactoryEntity>;
  update(
    id: string,
    artifactory: Partial<ArtifactoryEntity>,
  ): Promise<ArtifactoryEntity>;
  delete(id: string): Promise<void>;
}

export const ArtifactoryRepository = Symbol('IArtifactoryRepository');
