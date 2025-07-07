import console from 'console';

import {
  ArtifactoryEntity,
  ArtifactoryType,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { FolderDto } from '@driveapp/contracts/entities/artifactory/dtos/folder.dto';

import { Path, PathFactory, PathImpl } from './path';

export interface Folder {
  getName(): string;
  incrementSize(size: number): void;
  decrementSize(size: number): void;
  toJSON(): FolderDto & { path: string };
  toEntity(): ArtifactoryEntity;
  getPath(): Path;
  setPath(path: Path): void;
  setId(id: string): void;
  getId(): string;
  getOwnerId(): string;
  validate(): void;
}

export class FolderImpl implements Folder {
  private name: string;

  private type: ArtifactoryType = ArtifactoryType.FOLDER;

  private path: Path;

  private size?: number;

  private ownerId: string;

  private parentId?: string;

  private createdAt: Date;

  private updatedAt: Date;

  private id: string;

  constructor(data: FolderDto) {
    this.name = data.name;
    this.size = data.size;
    this.ownerId = data.ownerId;
    this.parentId = data.parentId;
    this.id = data.id || '';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  setPath(path: Path): void {
    this.path = path;
  }

  getPath(): Path {
    return this.path;
  }

  setId(id: string): void {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  incrementSize(size: number): void {
    let nextSize = (this.size || 0) + size;
    if (nextSize < 0) {
      nextSize = 0;
    }
    this.size = nextSize;
  }

  decrementSize(size: number): void {
    let nextSize = (this.size || 0) - size;
    if (nextSize < 0) {
      nextSize = 0;
    }
    this.size = nextSize;
  }

  validate(): void {
    if (!this.ownerId) {
      throw new Error('Owner ID is required');
    }
    if (!this.path) {
      throw new Error('Path is required');
    }
    if (!this.name) {
      throw new Error('Name is required');
    }
  }

  toEntity(): ArtifactoryEntity {
    const entity: ArtifactoryEntity = {
      name: this.name,
      type: this.type,
      path: this.path.getValue(),
      size: this.size,
      userId: this.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    entity.parentId = this.parentId || null;

    if (this.id) {
      entity._id = this.id;
    }
    return entity;
  }

  toJSON() {
    return {
      name: this.name,
      path: this.path.getValue(),
      size: this.size,
      ownerId: this.ownerId,
      parentId: this.parentId,
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      artifactoryCount: 0,
      type: this.type,
    };
  }

  getOwnerId(): string {
    return this.ownerId;
  }
}

export class FolderFactory {
  static fromEntity(entity: ArtifactoryEntity): Folder {
    const folder = new FolderImpl({
      id: entity._id,
      name: entity.name,
      ownerId: entity.userId,
      parentId: entity.parentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      artifactoryCount: 0,
      type: entity.type,
    });
    folder.setPath(PathFactory.fromEntity(entity));
    return folder;
  }
}
