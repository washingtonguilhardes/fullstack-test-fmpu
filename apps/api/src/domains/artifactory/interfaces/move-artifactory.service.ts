export interface MoveArtifactoryService {
  execute(
    artifactoryId: string,
    targetFolderId: string,
    ownerId: string,
  ): Promise<void>;
}

export const MoveArtifactoryServiceRef = Symbol('IMoveArtifactoryService');
