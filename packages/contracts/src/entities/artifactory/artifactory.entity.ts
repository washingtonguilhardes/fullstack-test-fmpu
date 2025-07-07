export enum ArtifactoryType {
  FILE = 'file',
  FOLDER = 'folder',
}

export interface ArtifactoryEntity {
  _id?: string;
  name: string;
  type: ArtifactoryType;
  userId: string;
  parentId?: string;
  path: string;
  mimeType?: string;
  checksum?: string;
  size?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNewFolderDto {
  name: string;
  parentId?: string;
}

export interface CreateNewFileDto {
  name: string;
  parentId?: string;
  path?: string;
  mimeType?: string;
  size?: number;
  checksum?: string;
  originalName?: string;
  buffer?: Buffer;
}

export interface UpdateArtifactoryDto {
  name?: string;
  parent_id?: string;
  path?: string;
  is_public?: boolean;
  access_url?: string;
  access_url_expires_at?: Date;
}
export interface ListArtifactoryByOwnerDto {
  files: ArtifactoryEntity[];
  folders: ArtifactoryEntity[];
}
