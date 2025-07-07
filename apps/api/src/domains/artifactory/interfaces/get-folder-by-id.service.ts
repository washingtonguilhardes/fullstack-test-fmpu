import { Folder } from '../domain';

export interface GetFolderByIdService {
  execute(id: string): Promise<Folder | null>;
}

export const GetFolderByIdServiceRef = Symbol('IGetFolderByIdService');
