import { File, Path } from '../domain';

export interface StorageFileAdapter {
  store(file: File, buffer: Buffer): Promise<void>;
  getTemporaryUrl(bucketPath: string): Promise<string>;
  delete(bucketPath: string): Promise<boolean>;
}

export const StorageFileAdapterRef = Symbol('IStorageFileAdapter');
