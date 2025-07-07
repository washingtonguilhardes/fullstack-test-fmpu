import { join } from 'path';

import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

export interface Path {
  getValue(): string;
  getRelativePath(): string;
  equals(path: Path): boolean;
  join(path: Path): Path;
  getParent(): Path;
  isRoot(): boolean;
  toJSON(): string;
}

export class PathImpl implements Path {
  constructor(
    private path: string,
    private root: boolean = false,
  ) {}

  getParent(): Path {
    const pathParts = this.path.split('/').filter((part) => part !== '');
    if (pathParts.length <= 1) {
      return new PathImpl('/', true);
    }
    const parentPath = '/' + pathParts.slice(0, -1).join('/');
    return new PathImpl(parentPath);
  }

  join(path: Path): Path {
    this.path = join(path.getValue(), this.path);
    return this;
  }

  getRelativePath(): string {
    return this.path.split('/').slice(1).join('/');
  }

  equals(path: Path): boolean {
    return this.path === path.getValue();
  }

  setPath(path: string): void {
    this.path = path;
  }

  toJSON() {
    return this.path;
  }

  getValue(): string {
    return this.path;
  }

  isRoot(): boolean {
    return this.root;
  }
}

export class PathFactory {
  private static sanitizeName(name: string): string {
    const sanitized = name.replace(/(\.\.[/\\])/g, '');

    const lastDotIndex = sanitized.lastIndexOf('.');
    const hasExtension =
      lastDotIndex > 0 && lastDotIndex < sanitized.length - 1;

    if (hasExtension) {
      const baseName = sanitized.substring(0, lastDotIndex);
      const extension = sanitized.substring(lastDotIndex).toLowerCase();

      const sanitizedBaseName = baseName
        .toLowerCase()
        .replace(/[._]/g, '-')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      return sanitizedBaseName + extension;
    } else {
      return sanitized
        .toLowerCase()
        .replace(/[._]/g, '-')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }

  static fromName(name: string): Path {
    return new PathImpl(PathFactory.sanitizeName(name));
  }

  static fromEntity(entity: Partial<ArtifactoryEntity>): Path {
    return new PathImpl(entity.path);
  }

  static root(ownerId: string): Path {
    return new PathImpl(`/${ownerId}`, true);
  }
}
