import { ArtifactoryType } from '../artifactory.entity';

export interface ArtifactoryDto {
  name: string;
  size?: number;
  ownerId: string;
  parentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
  mimeType?: string;
  path?: string;
  type?: ArtifactoryType;
}
