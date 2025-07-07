import { FolderDto } from '@driveapp/contracts/entities/artifactory/dtos/folder.dto';

import { Folder } from '../domain';

export interface CreateNewFolderService {
  execute(folder: FolderDto): Promise<Folder>;
}

export const CreateNewFolderServiceRef = Symbol('ICreateNewFolderService');
