import {
  ArtifactoryEntity,
  CreateArtifactoryDto,
  UpdateArtifactoryDto,
  ArtifactoryType,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';

export class Artifactory implements ArtifactoryEntity {
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

  constructor(data: ArtifactoryEntity) {
    this._id = data._id;
    this.name = data.name;
    this.type = data.type;
    this.user_id = data.user_id;
    this.parent_id = data.parent_id;
    this.path = data.path;
    this.server_name = data.server_name;
    this.mime_type = data.mime_type;
    this.size = data.size;
    this.access_url = data.access_url;
    this.access_url_expires_at = data.access_url_expires_at;
    this.storage_path = data.storage_path;
    this.storage_provider = data.storage_provider;
    this.checksum = data.checksum;
    this.is_public = data.is_public;
    this.upload_date = data.upload_date;
    this.last_accessed_at = data.last_accessed_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Domain methods
  updateInfo(updateData: UpdateArtifactoryDto): void {
    if (updateData.name !== undefined) {
      this.name = updateData.name;
    }
    if (updateData.parent_id !== undefined) {
      this.parent_id = updateData.parent_id;
    }
    if (updateData.path !== undefined) {
      this.path = updateData.path;
    }
    if (updateData.is_public !== undefined) {
      this.is_public = updateData.is_public;
    }
    if (updateData.access_url !== undefined) {
      this.access_url = updateData.access_url;
    }
    if (updateData.access_url_expires_at !== undefined) {
      this.access_url_expires_at = updateData.access_url_expires_at;
    }
    this.updated_at = new Date();
  }

  updateAccessUrl(url: string, expiresAt?: Date): void {
    this.access_url = url;
    this.access_url_expires_at = expiresAt;
    this.updated_at = new Date();
  }

  recordAccess(): void {
    this.last_accessed_at = new Date();
    this.updated_at = new Date();
  }

  makePublic(): void {
    this.is_public = true;
    this.updated_at = new Date();
  }

  makePrivate(): void {
    this.is_public = false;
    this.updated_at = new Date();
  }

  updateSize(newSize: number): void {
    this.size = newSize;
    this.updated_at = new Date();
  }

  updateChecksum(checksum: string): void {
    this.checksum = checksum;
    this.updated_at = new Date();
  }

  isFile(): boolean {
    return this.type === ArtifactoryType.FILE;
  }

  isFolder(): boolean {
    return this.type === ArtifactoryType.FOLDER;
  }

  isAccessUrlExpired(): boolean {
    if (!this.access_url_expires_at) {
      return false;
    }
    return new Date() > this.access_url_expires_at;
  }

  toEntity(): ArtifactoryEntity {
    return {
      _id: this._id,
      name: this.name,
      type: this.type,
      user_id: this.user_id,
      parent_id: this.parent_id,
      path: this.path,
      server_name: this.server_name,
      mime_type: this.mime_type,
      size: this.size,
      access_url: this.access_url,
      access_url_expires_at: this.access_url_expires_at,
      storage_path: this.storage_path,
      storage_provider: this.storage_provider,
      checksum: this.checksum,
      is_public: this.is_public,
      upload_date: this.upload_date,
      last_accessed_at: this.last_accessed_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
