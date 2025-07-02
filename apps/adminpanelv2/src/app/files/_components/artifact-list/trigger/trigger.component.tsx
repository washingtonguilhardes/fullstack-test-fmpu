import Link from 'next/link';

import {
  ArtifactoryEntity,
  ArtifactoryType
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { Button } from '@/components/ui/button';

import { FileIconComponent } from '../../shared';

export function TriggerComponent(props: { file: ArtifactoryEntity }) {
  const { file } = props;
  const { path, name, type } = file;

  const isFolder = type === ArtifactoryType.FOLDER;

  if (isFolder) {
    return (
      <div className="flex items-center space-x-2">
        <FileIconComponent file={file} size="sm" />
        <Button variant="link" asChild>
          <Link href={`/files?segment=${path}`}>{name}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <FileIconComponent file={file} size="sm" />
      <Button variant="link" asChild>
        <Link href={`/files?preview=${path}`}>{name}</Link>
      </Button>
    </div>
  );
}
