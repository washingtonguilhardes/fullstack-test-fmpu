export interface DeleteFolderByIdService {
  execute(folderId: string, ownerId: string): Promise<void>;
}

export const DeleteFolderByIdServiceRef = Symbol('IDeleteFolderByIdService');
