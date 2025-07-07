import { ArtifactoryEntity } from '../entities/artifactory/artifactory.entity';
import { ListArtifactoryParams } from '../entities/artifactory/dtos/list.dto';

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
    parentId: string | null,
    root?: boolean,
  ): Promise<ArtifactoryEntity[]>;
  findAllByUserIdPathAndName(
    userId: string,
    parentId: string,
    namePattern: string,
    root?: boolean,
  ): Promise<ArtifactoryEntity[]>;
  findAllByUserId(
    userId: string,
    params?: ListArtifactoryParams,
  ): Promise<ArtifactoryEntity[]>;
}

export const ArtifactoryRepositoryRef = Symbol('IArtifactoryRepository');
