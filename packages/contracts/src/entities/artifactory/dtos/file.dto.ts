import { ArtifactoryDto } from './artifactory.dto';

export interface FileDto extends ArtifactoryDto {
  mimeType?: string;
  checksum: string;
}
