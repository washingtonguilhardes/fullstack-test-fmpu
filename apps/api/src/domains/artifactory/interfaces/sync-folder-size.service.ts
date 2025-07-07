import { Folder } from '../domain';

export interface SyncFolderSizeService {
  execute(folder: Folder): Promise<void>;
}

export const SyncFolderSizeServiceRef = Symbol('ISyncFolderSizeService');
