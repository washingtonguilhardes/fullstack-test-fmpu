'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArtifactoryDto } from '@driveapp/contracts/entities/artifactory/dtos/artifactory.dto';
import { ListArtifactoryByOwnerDto } from '@driveapp/contracts/entities/artifactory/dtos/list.dto';

import {
  CompoundActionButton,
  type ActionType
} from '@/components/molecules/compound-action-button';
import { Button } from '@/components/ui/button';
import { useAccount } from '@/context/account/account.context';
import { useFileSearch } from '@/context/file-search/file-search.context';
import { restClient } from '@/lib/http/rest.client';
import { cn } from '@/lib/utils';
import { IconChevronRight, IconHome } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { ArtifactGridComponent } from '../artifact-cards';
import { FileActionDialogsComponent } from '../file-actions/file-action-dialogs.component';
import { FileActionProvider } from '../file-actions/file-actions.context';
import { CreateNewFolderComponent } from '../new-folder/create-new-folder.component';
import { UploadFlowComponent } from '../upload';
import { ArtifactsTable } from './table';
import { ViewMode, ViewToggleComponent } from './view-toggle.component';

export function ArtifactListComponent() {
  const { user } = useAccount();
  const { folder, segment, setSegment } = useFileSearch();
  const [uploadFlow, setUploadFlow] = useState<boolean>(false);
  const [createNewFolderFlow, setCreateNewFolderFlow] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const { search } = useFileSearch();

  const router = useRouter();

  const { data, isLoading, refetch } = useQuery<ListArtifactoryByOwnerDto>({
    queryKey: ['files', folder?.id, search, segment],
    queryFn: () => {
      return restClient
        .get<ListArtifactoryByOwnerDto>('/files', {
          params: {
            parentId: folder?.id,
            artifactoryName: search
          }
        })
        .then(res => res.data);
    }
  });
  const artifacts = useMemo(() => {
    return [
      ...(data?.folders ?? []).filter(f => (folder?.id ? f.id !== folder?.id : true)),
      ...(data?.files ?? [])
    ];
  }, [data]);
  console.log({ artifacts });

  useEffect(() => {
    if (folder?.id && !isLoading) {
      refetch();
    }
  }, [folder, isLoading]);

  const breadcrumb = useMemo(() => {
    const segments = segment.split('/').filter(Boolean);
    return segments.map((v, index) => {
      const isRoot = v === user?.id;
      return {
        key: `breadcrumb-[${v}-${index}]`,
        label: isRoot ? '' : v,
        path: isRoot ? '' : `/${segments.slice(0, index + 1).join('/')}`,
        isLast: index === segments.length - 1,
        isRoot
      };
    });
  }, [segment]);

  return (
    <FileActionProvider>
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4 w-full">
        <div className="flex items-center space-x-4 gap-4 w-full md:w-auto justify-between md:flex-1">
          <div className="text-2xl font-bold w-full flex-1 ">
            <div className="flex items-center gap-2">
              {breadcrumb.map(v => {
                return (
                  <Fragment key={v.key}>
                    <Link
                      href={v.isRoot ? '/files' : `/files?segment=${v.path}`}
                      onClick={() => {
                        if (!v.isLast) {
                          setSegment(v.path);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-2',
                        !v.isLast
                          ? 'text-primary'
                          : 'text-muted-foreground  pointer-events-none'
                      )}
                    >
                      {v.isRoot ? <IconHome /> : <IconChevronRight />}
                      {v.label}
                    </Link>
                  </Fragment>
                );
              })}
            </div>
          </div>
          <ViewToggleComponent viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
        <div className="flex items-center space-x-4 gap-4 w-full md:w-auto">
          <CompoundActionButton
            onAction={(action: ActionType) => {
              if (action === 'file') {
                setUploadFlow(true);
              } else {
                setCreateNewFolderFlow(true);
              }
            }}
          />
        </div>
      </div>
      {uploadFlow && (
        <UploadFlowComponent
          open={uploadFlow}
          onOpenChange={setUploadFlow}
          parent={folder?.id ?? ''}
          onUpload={() => {
            refetch();
          }}
        />
      )}
      {createNewFolderFlow && (
        <CreateNewFolderComponent
          open={createNewFolderFlow}
          onOpenChange={setCreateNewFolderFlow}
          parent={folder?.id ?? ''}
          onSuccess={path => {
            setCreateNewFolderFlow(false);
            if (path) {
              router.push(`/files?segment=${path}`);
              setSegment(path);
            }
          }}
        />
      )}
      <FileActionDialogsComponent
        onReloadFileList={() => {
          refetch();
        }}
      />
      {viewMode === 'table' ? (
        <ArtifactsTable files={artifacts} />
      ) : (
        <ArtifactGridComponent files={artifacts} />
      )}
    </FileActionProvider>
  );
}
