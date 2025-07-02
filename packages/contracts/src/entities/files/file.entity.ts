export enum FileType {
  FILE = 'file',
  FOLDER = 'folder',
}

export enum FileStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export enum FileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum FileAccess {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
}

export interface FileEntity {
  id: string;
  name: string;
  type: FileType;
  path: string;
  size: number;
  status: FileStatus;
  visibility: FileVisibility;
  access: FileAccess;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    email: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
