'use client';

import { useEffect, useState } from 'react';

import { FileEntity } from '@driveapp/contracts/entities/files/file.entity';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

import { ArtifactGridComponent } from '../artifact-cards';
import { FileActionDialogsComponent } from '../file-actions/file-action-dialogs.component';
import { FileActionProvider } from '../file-actions/file-actions.context';
import { UploadFlowComponent } from '../upload';
import { ArtifactsTable } from './table';
import { ViewToggleComponent, ViewMode } from './view-toggle.component';

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
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  useEffect(() => {
    if (segment !== activeSegment) {
      console.log('segment changed from initial', segment);
      setActiveSegment(segment);
    }
  }, [segment, activeSegment]);

  return (
    <FileActionProvider>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Files</h1>
        <div className="flex items-center space-x-4">
          <ViewToggleComponent viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button variant="outline" onClick={() => setUploadFlow(true)}>
            <IconPlus />
            Add Files
          </Button>
        </div>
      </div>
      <UploadFlowComponent open={uploadFlow} onOpenChange={setUploadFlow} />
      <FileActionDialogsComponent />
      {viewMode === 'table' ? (
        <ArtifactsTable files={data} />
      ) : (
        <ArtifactGridComponent files={data} />
      )}
    </FileActionProvider>
  );
}
