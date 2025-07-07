import { Folder } from '../domain';

export interface GetFolderByPathService {
  execute(path: string, ownerId: string): Promise<Folder | null>;
}

export const GetFolderByPathServiceRef = Symbol('IGetFolderByPathService');
