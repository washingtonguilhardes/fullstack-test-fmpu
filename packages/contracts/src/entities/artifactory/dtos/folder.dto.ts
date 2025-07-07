import { ArtifactoryDto } from './artifactory.dto';

export interface FolderDto extends ArtifactoryDto {
  artifactoryCount: number;
}
