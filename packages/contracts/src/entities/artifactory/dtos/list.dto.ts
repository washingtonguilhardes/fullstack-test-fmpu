import { ArtifactoryType } from '../artifactory.entity';
import { FileDto } from './file.dto';
import { FolderDto } from './folder.dto';

export interface ListArtifactoryByOwnerDto {
  files: FileDto[];
  folders: FolderDto[];
}

export interface ListArtifactoryParams {
  ownerId: string;
  pathId?: string;
  artifactoryName?: string;
  type?: ArtifactoryType;
  includeAll?: boolean;
}
