import { useMemo, useState } from 'react';

import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ListArtifactoryByOwnerDto } from '@driveapp/contracts/entities/artifactory/dtos/list.dto';

import { ConfirmationDialog } from '@/components/templates';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAccount } from '@/context/account/account.context';
import { useFileSearch } from '@/context/file-search/file-search.context';
import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { IconFolder, IconLoader } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface MoveFileComponentProps {
  filename: string;
  fileId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function MoveFileComponent(props: MoveFileComponentProps) {
  const { filename, fileId, open, setOpen, onSuccess } = props;
  const { user } = useAccount();
  const { folder } = useFileSearch();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  const { data: folders = [], isLoading: isLoadingFolders } = useQuery({
    queryKey: ['folders'],
    queryFn: () =>
      restClient.get<ListArtifactoryByOwnerDto>(`/files`, {
        params: {
          includeAll: true,
          type: ArtifactoryType.FOLDER
        }
      }),
    select: res => res.data.folders
  });

  // maybe think about root folder
  const {
    mutate: moveFile,
    isPending: isMoving,
    isSuccess: isMoved,
    error: moveError
  } = useMutation({
    mutationFn: (folderId: string) => {
      return restClient.post(`/files/${fileId}/move`, {
        artifactoryId: fileId,
        targetFolderId: folderId
      });
    },
    onSuccess: () => onSuccess()
  });

  const errorMessage = useMemo(() => {
    if (moveError) {
      return parseErrorResponse(moveError);
    }
    return null;
  }, [moveError]);

  return (
    <ConfirmationDialog
      title="Move File"
      description="Select a destination folder for the file"
      message={
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label htmlFor="folder-select" className="text-sm font-medium">
              Destination folder
            </label>
            <Select
              value={selectedFolderId}
              onValueChange={setSelectedFolderId}
              disabled={isLoading}
            >
              <SelectTrigger disabled={isLoadingFolders} className="w-full">
                <SelectValue placeholder="Select a folder" className="h-[38px]" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {folders
                  .filter(f => f.id !== folder?.id)
                  .map(folder => (
                    <SelectItem key={folder.id} value={folder.id!}>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <IconFolder />
                          {folder.name}
                          <span className="text-xs text-muted-foreground">
                            {folder.path?.replace(`${user?.id}/`, '')}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errorMessage && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage.message}</AlertDescription>
              </Alert>
            )}
            {isMoved && (
              <Alert variant="success">
                <AlertTitle>File moved successfully</AlertTitle>
                <AlertDescription>
                  File moved successfully to {selectedFolderId}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Moving: <b>{filename}</b>
          </div>
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      confirm={
        <>
          {!isMoved && (
            <Button
              onClick={() => moveFile(selectedFolderId)}
              disabled={isMoving || !selectedFolderId}
            >
              {isMoving && <IconLoader className="animate-spin" />} Move
            </Button>
          )}
          {isMoved && (
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          )}
        </>
      }
      cancel={<Button variant="secondary">Cancel</Button>}
    />
  );
}
