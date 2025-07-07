import { File, Folder, Path } from '../domain';

export interface ListArtifactoryByOwnerService {
  execute(params: {
    ownerId: string;
    path?: Path;
    pathId?: string;
    artifactoryName?: string;
  }): Promise<{
    files: File[];
    folders: Folder[];
  }>;
}

export const ListArtifactoryByOwnerServiceRef = Symbol(
  'IListArtifactoryByOwnerService',
);
