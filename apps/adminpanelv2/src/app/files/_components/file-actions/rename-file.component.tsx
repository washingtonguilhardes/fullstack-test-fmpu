import { useState } from 'react';

import { ConfirmationDialog } from '@/components/templates';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { IconLoader } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

export interface RenameFileComponentProps {
  filename: string;
  fileId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function RenameFileComponent(props: RenameFileComponentProps) {
  const { filename, fileId, open, setOpen, onSuccess } = props;

  const [newFilename, setNewFilename] = useState(filename);

  const {
    mutate: renameFile,
    isPending,
    isSuccess,
    error
  } = useMutation({
    mutationKey: ['rename-file', fileId],
    mutationFn: (newFilename: string) =>
      restClient.put(`/files/${fileId}/rename`, { newName: newFilename }),
    onSuccess: () => onSuccess()
  });

  const handleRename = () => {
    if (!newFilename.trim() || newFilename === filename) {
      return;
    }
    renameFile(newFilename);
  };

  const errorMessage = error && parseErrorResponse(error);

  return (
    <ConfirmationDialog
      title="Rename File"
      description="Enter a new name for the file"
      message={
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label htmlFor="new-filename" className="text-sm font-medium">
              New filename
            </label>
            <Input
              id="new-filename"
              value={newFilename}
              onChange={e => setNewFilename(e.target.value)}
              placeholder="Enter new filename"
              disabled={isPending}
            />
          </div>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage.message}</AlertDescription>
            </Alert>
          )}
          {isSuccess && (
            <Alert variant="success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>File renamed successfully</AlertDescription>
            </Alert>
          )}
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      confirm={
        <>
          {isSuccess ? (
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          ) : (
            <Button
              onClick={handleRename}
              disabled={isPending || !newFilename.trim() || newFilename === filename}
            >
              {isPending && <IconLoader className="animate-spin" />} Rename
            </Button>
          )}
        </>
      }
      cancel={!isSuccess && <Button variant="secondary">Cancel</Button>}
    />
  );
}
