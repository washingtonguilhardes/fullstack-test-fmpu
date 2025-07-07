import { File } from '../domain';

export interface UploadFileService {
  execute(file: File, buffer: Buffer): Promise<void>;
}

export const UploadFileServiceRef = Symbol('IUploadFileService');
