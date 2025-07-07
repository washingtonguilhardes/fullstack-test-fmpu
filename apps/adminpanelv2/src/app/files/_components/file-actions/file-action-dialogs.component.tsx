'use client';

import { useMemo } from 'react';

import { useFileSearch } from '@/context/file-search/file-search.context';

import { DeleteFileComponent } from './delete-file.component';
import { useFileActions, FileAction } from './file-actions.context';
import { MoveFileComponent } from './move-file.component';
import { RenameFileComponent } from './rename-file.component';
import { ShareFileComponent } from './share-file.component';

export function FileActionDialogsComponent(props: { onReloadFileList: () => void }) {
  const { onReloadFileList } = props;
  const { selectedFile, currentAction, isActionOpen, closeAction } = useFileActions();

  return useMemo(() => {
    if (!selectedFile || !currentAction || !isActionOpen) {
      return null;
    }
    const fileId = selectedFile.id ?? '';
    switch (currentAction) {
      case FileAction.DELETE:
        return (
          <DeleteFileComponent
            filename={selectedFile.name}
            fileId={fileId}
            open={isActionOpen}
            setOpen={closeAction}
            onSuccess={() => {
              onReloadFileList();
            }}
          />
        );
      case FileAction.RENAME:
        return (
          <RenameFileComponent
            filename={selectedFile.name}
            fileId={fileId}
            open={isActionOpen}
            setOpen={closeAction}
          />
        );
      case FileAction.MOVE:
        return (
          <MoveFileComponent
            filename={selectedFile.name}
            fileId={fileId}
            open={isActionOpen}
            setOpen={closeAction}
          />
        );
      case FileAction.SHARE:
        return (
          <ShareFileComponent
            filename={selectedFile.name}
            fileId={fileId}
            open={isActionOpen}
            setOpen={closeAction}
          />
        );
      case FileAction.DOWNLOAD:
        // Handle download logic here
        console.log('Downloading file:', selectedFile.name);
        closeAction();
        return null;
      default:
        return null;
    }
  }, [selectedFile, currentAction, isActionOpen, closeAction]);
}
