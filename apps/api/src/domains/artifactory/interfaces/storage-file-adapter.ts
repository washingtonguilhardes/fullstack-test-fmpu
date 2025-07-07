import { File, Path } from '../domain';

export interface StorageFileAdapter {
  store(file: File, buffer: Buffer): Promise<void>;
  getTemporaryUrl(path: Path): Promise<string>;
  delete(path: Path): Promise<boolean>;
  move(sourcePath: Path, targetPath: Path): Promise<boolean>;
}

export const StorageFileAdapterRef = Symbol('IStorageFileAdapter');
