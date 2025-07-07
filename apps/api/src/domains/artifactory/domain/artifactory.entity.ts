import { ArtifactoryDto } from '@driveapp/contracts/entities/artifactory/dtos/artifactory.dto';
import { FileDto } from '@driveapp/contracts/entities/artifactory/dtos/file.dto';
import { FolderDto } from '@driveapp/contracts/entities/artifactory/dtos/folder.dto';

import { File, FileImpl } from './file';
import { Folder, FolderImpl } from './folder';

export interface Artifactory {
  toJSON(): ArtifactoryDto;
}

export class ArtifactoryImpl implements Artifactory {
  private id: string;

  private name: string;

  private size: number;

  private mimeType: string;

  private createdAt: Date;

  private path: string;

  private ownerId: string;

  constructor(data: ArtifactoryDto & { path: string; ownerId: string }) {
    this.id = data.id;
    this.name = data.name;
    this.size = data.size;
    this.mimeType = data.mimeType;
    this.createdAt = data.createdAt;
    this.path = data.path;
    this.ownerId = data.ownerId;
  }

  toJSON(): ArtifactoryDto & { path: string; ownerId: string } {
    return {
      id: this.id,
      name: this.name,
      size: this.size,
      mimeType: this.mimeType,
      path: this.path,
      ownerId: this.ownerId,
    };
  }
}

export class ArtifactoryFactory {
  static fileFactory(data: FileDto): File {
    return new FileImpl(data);
  }

  static folderFactory(data: FolderDto): Folder {
    return new FolderImpl(data);
  }

  static artifactoryFactory(
    data: ArtifactoryDto & { path: string; ownerId: string },
  ): Artifactory {
    return new ArtifactoryImpl(data);
  }
}
