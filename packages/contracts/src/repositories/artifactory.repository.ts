import { ArtifactoryEntity } from '../entities/artifactory/artifactory.entity';

export interface ArtifactoryRepository {
  findById(id: string): Promise<ArtifactoryEntity | null>;
  findByPath(path: string): Promise<ArtifactoryEntity | null>;
  findAllByPath(path: string): Promise<ArtifactoryEntity[]>;
  create(artifactory: ArtifactoryEntity): Promise<ArtifactoryEntity>;
  update(
    id: string,
    artifactory: Partial<ArtifactoryEntity>,
  ): Promise<ArtifactoryEntity>;
  delete(ids: string[]): Promise<void>;
  findAllByUserIdAndPath(
    userId: string,
    path: string | null,
  ): Promise<ArtifactoryEntity[]>;
  findAllByUserIdPathAndName(
    userId: string,
    path: string,
    namePattern: string,
  ): Promise<ArtifactoryEntity[]>;
}

export const ArtifactoryRepositoryRef = Symbol('IArtifactoryRepository');
