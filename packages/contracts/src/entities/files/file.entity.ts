import { UserEntity } from "../users/user.entity";

export enum FileType {
  FILE = 'file',
  FOLDER = 'folder',
}

export enum FileStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
}

export enum FileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum FileAccess {
  READ = 'read',
  WRITE = 'write',
}

export interface FileEntity {
  id: string;
  name: string;
  path: string;
  type: FileType;
  size: number;
  status: FileStatus;
  visibility: FileVisibility;
  access: FileAccess;
  owner?: Partial<UserEntity>;
  createdAt?: string;
  updatedAt?: string;
}
