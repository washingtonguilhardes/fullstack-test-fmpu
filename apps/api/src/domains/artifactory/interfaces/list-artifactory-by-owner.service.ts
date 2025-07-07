import {
  ListArtifactoryByOwnerDto,
  ListArtifactoryParams,
} from '@driveapp/contracts/entities/artifactory/dtos/list.dto';

export interface ListArtifactoryByOwnerService {
  execute(params: ListArtifactoryParams): Promise<ListArtifactoryByOwnerDto>;
}

export const ListArtifactoryByOwnerServiceRef = Symbol(
  'IListArtifactoryByOwnerService',
);
