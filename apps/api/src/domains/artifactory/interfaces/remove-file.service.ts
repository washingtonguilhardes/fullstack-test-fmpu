import { File } from '../domain';

export interface RemoveFileService {
  execute(file: File): Promise<void>;
}

export const RemoveFileServiceRef = Symbol('IRemoveFileService');
