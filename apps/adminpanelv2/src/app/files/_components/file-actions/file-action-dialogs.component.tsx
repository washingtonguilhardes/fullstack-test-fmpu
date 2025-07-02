'use client';

import { DeleteFileComponent } from './delete-file.component';
import { useFileActions, FileAction } from './file-actions.context';
import { MoveFileComponent } from './move-file.component';
import { RenameFileComponent } from './rename-file.component';
import { ShareFileComponent } from './share-file.component';

export function FileActionDialogsComponent() {
  const { selectedFile, currentAction, isActionOpen, closeAction } = useFileActions();

  if (!selectedFile || !currentAction || !isActionOpen) {
    return null;
  }

  const renderDialog = () => {
    switch (currentAction) {
      case FileAction.DELETE:
        return (
          <DeleteFileComponent
            filename={selectedFile.name}
            fileId={selectedFile.id}
            open={isActionOpen}
            setOpen={closeAction}
          />
        );
      case FileAction.RENAME:
        return (
          <RenameFileComponent
            filename={selectedFile.name}
            fileId={selectedFile.id}
            open={isActionOpen}
            setOpen={closeAction}
          />
        );
      case FileAction.MOVE:
        return (
          <MoveFileComponent
            filename={selectedFile.name}
            fileId={selectedFile.id}
            open={isActionOpen}
            setOpen={closeAction}
          />
        );
      case FileAction.SHARE:
        return (
          <ShareFileComponent
            filename={selectedFile.name}
            fileId={selectedFile.id}
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
  };

  return renderDialog();
}
