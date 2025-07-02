export enum ArtifactoryType {
  FILE = 'file',
  FOLDER = 'folder',
}

export interface ArtifactoryEntity {
  _id: string;
  name: string;
  type: ArtifactoryType;
  user_id: string;
  parent_id?: string;
  path: string;

  server_name?: string;
  mime_type?: string;
  size?: number;
  access_url?: string;
  access_url_expires_at?: Date;
  storage_path?: string;
  storage_provider?: string;
  checksum?: string;
  is_public?: boolean;
  upload_date?: Date;
  last_accessed_at?: Date;

  created_at: Date;
  updated_at: Date;
}

export interface CreateArtifactoryDto {
  name: string;
  type: ArtifactoryType;
  user_id: string;
  parent_id?: string;
  path: string;
  server_name?: string;
  mime_type?: string;
  size?: number;
  storage_path?: string;
  storage_provider?: string;
  checksum?: string;
  is_public?: boolean;
  is_root?: boolean;
}

export interface UpdateArtifactoryDto {
  name?: string;
  parent_id?: string;
  path?: string;
  is_public?: boolean;
  access_url?: string;
  access_url_expires_at?: Date;
}

export interface ArtifactoryWithUser extends ArtifactoryEntity {
  user?: {
    _id: string;
    full_name: string;
    email: string;
  };
}

export interface ArtifactoryWithParent extends ArtifactoryEntity {
  parent?: {
    _id: string;
    name: string;
    path: string;
    type: ArtifactoryType;
  };
}

export interface ArtifactoryWithChildren extends ArtifactoryEntity {
  children?: ArtifactoryEntity[];
}

export interface ArtifactoryWithStats extends ArtifactoryEntity {
  total_files?: number;
  total_size?: number;
  file_types?: Record<string, number>;
}
