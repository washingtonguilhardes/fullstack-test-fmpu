import { CreateNewFileDto } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { User } from '@/domains/users';

import { File } from '../domain';

export interface StoreFileUsecase {
  execute(owner: User, file: CreateNewFileDto): Promise<File>;
}

export const StoreFileUsecaseRef = Symbol('IStoreFileUsecase');
