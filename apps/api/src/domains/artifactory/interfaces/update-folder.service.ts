import { Folder } from '../domain';

export interface UpdateFolderService {
  execute(folder: Folder): Promise<void>;
}

export const UpdateFolderServiceRef = Symbol('IUpdateFolderService');
