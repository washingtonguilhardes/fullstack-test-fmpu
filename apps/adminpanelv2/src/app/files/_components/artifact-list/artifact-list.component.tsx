'use client';

import { useEffect, useState } from 'react';

import { FileEntity } from '@driveapp/contracts/entities/files/file.entity';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

import { UploadFlowComponent } from '../upload';
import { ArtifactsTable } from './table';

interface ArtifactListComponentProps {
  files: FileEntity[];
  segment?: string;
}

export function ArtifactListComponent({
  files = [],
  segment = ''
}: ArtifactListComponentProps) {
  const [data, setData] = useState<FileEntity[]>(files);
  const [activeSegment, setActiveSegment] = useState<string>(segment);
  const [uploadFlow, setUploadFlow] = useState<boolean>(false);

  useEffect(() => {
    if (segment !== activeSegment) {
      console.log('segment changed from initial', segment);
      setActiveSegment(segment);
    }
  }, [segment, activeSegment]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Files</h1>
        <Button variant="outline" onClick={() => setUploadFlow(true)}>
          <IconPlus />
          Add Files
        </Button>
      </div>
      <UploadFlowComponent open={uploadFlow} onOpenChange={setUploadFlow} />
      <ArtifactsTable files={data} />
    </>
  );
}
