export interface DeleteFileByIdService {
  execute(fileId: string, ownerId: string): Promise<void>;
}

export const DeleteFileByIdServiceRef = Symbol('IDeleteFileByIdService');
