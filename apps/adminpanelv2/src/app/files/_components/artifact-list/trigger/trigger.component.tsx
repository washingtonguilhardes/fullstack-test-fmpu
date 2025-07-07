import Link from 'next/link';

import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryDto } from '@driveapp/contracts/entities/artifactory/dtos/artifactory.dto';

import { Button } from '@/components/ui/button';
import { useFileSearch } from '@/context/file-search/file-search.context';

import { FileIconComponent } from '../../shared';

export function TriggerComponent(props: { file: ArtifactoryDto }) {
  const { file } = props;
  const { path, name, type } = file;
  const { setSegment } = useFileSearch();

  const isFolder = type === ArtifactoryType.FOLDER;

  const getParentFolder = () => {
    if (!isFolder) {
      const parentPath = path?.split('/').slice(0, -1).join('/');
      return parentPath || '';
    }
    return path || '';
  };

  if (isFolder) {
    return (
      <div className="flex items-center space-x-2">
        <FileIconComponent file={file} size="sm" />
        <Button variant="link" asChild>
          <Link
            href={`/files?segment=${path}`}
            onClick={() => setSegment(file.path || '')}
          >
            {name}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <FileIconComponent file={file} size="sm" />
      <Button variant="link" asChild>
        <Link
          href={`/files?preview=${path}&segment=${getParentFolder()}`}
          onClick={() => setSegment(getParentFolder())}
        >
          {name}
        </Link>
      </Button>
    </div>
  );
}
