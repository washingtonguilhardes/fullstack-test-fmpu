import { File, Path } from '../domain';

export interface CreateNewFileService {
  execute(file: File, parentPath: Path): Promise<File>;
}

export const CreateNewFileServiceRef = Symbol('ICreateNewFileService');
