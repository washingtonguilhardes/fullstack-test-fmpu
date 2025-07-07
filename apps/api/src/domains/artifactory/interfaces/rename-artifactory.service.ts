export interface RenameArtifactoryService {
  execute(
    artifactoryId: string,
    newName: string,
    ownerId: string,
  ): Promise<void>;
}

export const RenameArtifactoryServiceRef = Symbol('IRenameArtifactoryService');
