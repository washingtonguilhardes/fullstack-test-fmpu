import { File, Folder } from '../domain';

export interface MoveFileService {
  execute(file: File, destinationFolder: Folder): Promise<void>;
}

export const MoveFileServiceRef = Symbol('IMoveFileService');
