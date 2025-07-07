import { Folder, Path } from '../domain';

export interface ListFoldersByPathService {
  execute(path: Path): Promise<Folder[]>;
}

export const ListFoldersByPathServiceRef = Symbol('IListFoldersByPathService');
