import { File, Path } from '../domain';

export interface ListFilesByPathService {
  execute(path: Path): Promise<File[]>;
}

export const ListFilesByPathServiceRef = Symbol('IListFilesByPathService');
