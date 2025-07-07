import { Folder } from '../domain';

export interface RemoveFolderService {
  execute(folder: Folder): Promise<void>;
}

export const RemoveFolderServiceRef = Symbol('IRemoveFolderService');
