import { File } from '../domain';

export interface UpdateFileService {
  execute(file: File): Promise<void>;
}

export const UpdateFileServiceRef = Symbol('IUpdateFileService');
