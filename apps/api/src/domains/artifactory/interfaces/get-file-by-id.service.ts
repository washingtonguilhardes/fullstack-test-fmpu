import { File } from '../domain';

export interface GetFileByIdService {
  execute(id: string): Promise<File | null>;
}

export const GetFileByIdServiceRef = Symbol('IGetFileByIdService');
