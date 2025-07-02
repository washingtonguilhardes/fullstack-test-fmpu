import Link from 'next/link';

import { FileEntity, FileType } from '@driveapp/contracts/entities/files/file.entity';

import { Button } from '@/components/ui/button';

import { FileIconComponent } from '../../shared';

export function TriggerComponent(props: { file: FileEntity }) {
  const { file } = props;
  const { path, name, type } = file;

  const isFolder = type === FileType.FOLDER;

  if (isFolder) {
    return (
      <div className="flex items-center space-x-2">
        <FileIconComponent file={file} size="sm" />
        <Button variant="link" asChild>
          <Link href={`/files?folder=${path}`}>{name}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <FileIconComponent file={file} size="sm" />
      <Button variant="link" asChild>
        <Link href={`/files?file=${path}`}>{name}</Link>
      </Button>
    </div>
  );
}
