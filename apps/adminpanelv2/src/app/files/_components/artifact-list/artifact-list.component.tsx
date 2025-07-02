'use client';

import { useEffect, useState } from 'react';

import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import {
  CompoundActionButton,
  type ActionType
} from '@/components/molecules/compound-action-button';

import { ArtifactGridComponent } from '../artifact-cards';
import { FileActionDialogsComponent } from '../file-actions/file-action-dialogs.component';
import { FileActionProvider } from '../file-actions/file-actions.context';
import { UploadFlowComponent } from '../upload';
import { ArtifactsTable } from './table';
import { ViewToggleComponent, ViewMode } from './view-toggle.component';

interface ArtifactListComponentProps {
  files: ArtifactoryEntity[];
  segment?: string;
  preview?: boolean;
}

export function ArtifactListComponent({
  files = [],
  segment = '',
  preview = false
}: ArtifactListComponentProps) {
  const [data, setData] = useState<ArtifactoryEntity[]>(files);
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
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4 w-full">
        <div className="flex items-center space-x-4 gap-4 w-full md:w-auto justify-between md:flex-1">
          <div className="text-2xl font-bold w-full flex-1 ">Files {segment}</div>
          <ViewToggleComponent viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
        <div className="flex items-center space-x-4 gap-4 w-full md:w-auto">
          <CompoundActionButton
            onAction={(action: ActionType) => {
              if (action === 'file') {
                setUploadFlow(true);
              } else {
                // Handle folder creation - you can implement this later
                console.log('Create new folder');
              }
            }}
          />
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
