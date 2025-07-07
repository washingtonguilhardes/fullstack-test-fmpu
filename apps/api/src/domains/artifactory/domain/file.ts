import {
  ArtifactoryEntity,
  ArtifactoryType,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { FileDto } from '@driveapp/contracts/entities/artifactory/dtos/file.dto';

import { Path, PathFactory } from '@/domains/artifactory/domain/path';

import { Folder } from './folder';

export interface File {
  getName(): string;
  setId(id: string): void;
  getId(): string;
  setPath(path: Path): void;
  getPath(): Path;
  getMimeType(): string;
  getChecksum(): string;
  getOwnerId(): string;
  validate(): void;
  toJSON(): FileDto;
  toEntity(): ArtifactoryEntity;
  moveToFolder(folder: Folder): void;
}

export class FileImpl implements File {
  private name: string;

  private type: ArtifactoryType = ArtifactoryType.FILE;

  private size?: number;

  private id: string;

  private ownerId: string;

  private path: Path;

  private parentId?: string;

  private mimeType: string;

  private createdAt: Date;

  private updatedAt: Date;

  private checksum: string;

  constructor(data: FileDto) {
    this.id = data.id;
    this.name = data.name;
    this.size = data.size;
    this.ownerId = data.ownerId;
    this.parentId = data.parentId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.checksum = data.checksum;
    this.type = data.type;
    this.mimeType = data.mimeType || 'application/octet-stream';
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getChecksum(): string {
    return this.checksum;
  }

  getMimeType(): string {
    return this.mimeType;
  }

  getName(): string {
    return this.name;
  }

  setPath(path: Path): void {
    this.path = path;
  }

  getPath(): Path {
    return this.path;
  }

  moveToFolder(folder: Folder): void {
    this.parentId = folder.getId();
    this.path = folder.getPath().join(this.path);
  }

  setId(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  isFile(): boolean {
    return this.type === ArtifactoryType.FILE;
  }

  isFolder(): boolean {
    return this.type === ArtifactoryType.FOLDER;
  }

  incrementSize(size: number) {
    if (this.isFile()) {
      throw new Error('Cannot increment size of a file');
    }
    this.size = (this.size || 0) + size;
  }

  decrementSize(size: number) {
    if (this.isFile()) {
      throw new Error('Cannot decrement size of a file');
    }
    this.size = (this.size || 0) - size;
  }

  private validateMimeType(): void {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    if (!this.mimeType) {
      throw new Error('Mime type is required');
    }
    if (!allowedMimeTypes.includes(this.mimeType)) {
      throw new Error('Only images and documents are allowed to be uploaded');
    }
  }

  validate(): void {
    if (!this.name) {
      throw new Error('Name is required');
    }

    if (!this.path) {
      throw new Error('Path is required');
    }
    if (this.size && this.size < 0 && this.isFolder()) {
      throw new Error('Size cannot be negative');
    }
    if (!this.ownerId) {
      throw new Error('Owner ID is required');
    }
    if (!this.checksum) {
      throw new Error('Checksum is required');
    }
    this.validateMimeType();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      path: this.path.getValue(),
      size: this.size,
      mimeType: this.mimeType,
      ownerId: this.ownerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      checksum: this.checksum,
      type: this.type,
    };
  }

  toEntity(): ArtifactoryEntity {
    return {
      _id: this.id,
      name: this.name,
      type: this.type,
      userId: this.ownerId,
      parentId: this.parentId,
      path: this.path.getValue(),
      mimeType: this.mimeType,
      size: this.size,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      checksum: this.checksum,
    };
  }
}

export class FileFactory {
  static fromEntity(entity: ArtifactoryEntity): File {
    const file = new FileImpl({
      id: entity._id,
      name: entity.name,
      ownerId: entity.userId,
      parentId: entity.parentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      checksum: entity.checksum,
      mimeType: entity.mimeType,
      size: entity.size,
      type: entity.type,
    });
    file.setPath(PathFactory.fromEntity(entity));
    return file;
  }

  static fromDto(dto: FileDto): File {
    return new FileImpl(dto);
  }
}
