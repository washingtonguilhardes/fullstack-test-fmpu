'use client';

import { useEffect, useState } from 'react';

import { FileEntity } from '@driveapp/contracts/entities/files/file.entity';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconFile, IconX } from '@tabler/icons-react';

import { ArtifactsTable } from './table';
import { UploadFileComponent } from './upload/upload-file.component';

interface ArtifactListComponentProps {
  files: FileEntity[];
  segment?: string;
}

export function ArtifactListComponent({
  files = [],
  segment = ''
}: ArtifactListComponentProps) {
  const [data, setData] = useState<FileEntity[]>(files);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeSegment, setActiveSegment] = useState<string>(segment);

  useEffect(() => {
    if (segment !== activeSegment) {
      console.log('segment changed from initial', segment);
      setActiveSegment(segment);
    }
  }, [segment, activeSegment]);

  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-4 mb-4',
          uploadedFiles.length > 0 && 'bg-muted p-4 rounded-lg'
        )}
      >
        <UploadFileComponent
          onChange={files => {
            setUploadedFiles(prev => [...prev, ...files]);
          }}
        />
        {uploadedFiles.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {uploadedFiles.map(file => (
                <div
                  key={file.name}
                  className="inline-flex items-center gap-2 bg-input/50 p-2 pl-4 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <IconFile size={16} />
                    {file.name}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setUploadedFiles(prev => prev.filter(f => f.name !== file.name));
                    }}
                  >
                    <IconX size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-fit">
              Save
            </Button>
          </div>
        )}
      </div>
      <ArtifactsTable files={data} />
    </>
  );
}
