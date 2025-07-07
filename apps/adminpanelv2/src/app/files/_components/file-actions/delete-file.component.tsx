import { useState } from 'react';

import { ConfirmationDialog } from '@/components/templates';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { IconLoader } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

export interface DeleteFileComponentProps {
  filename: string;
  fileId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteFileComponent(props: DeleteFileComponentProps) {
  const { filename, fileId, open, setOpen, onSuccess } = props;

  const {
    mutate: deleteFile,
    isPending,
    error
  } = useMutation({
    mutationFn: (fileId: string) => {
      return restClient.delete(`/files/${fileId}/remove`);
    },
    onSuccess: () => {
      onSuccess();
      setOpen(false);
    }
  });

  const errorMessage = error && parseErrorResponse(error);

  return (
    <ConfirmationDialog
      title="Delete File"
      description="Are you sure you want to delete this file?"
      message={
        <div className="flex flex-col gap-2">
          <div>
            Are you sure you want to delete <b>{filename}</b>?
          </div>
          {errorMessage?.message && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage.message}</AlertDescription>
            </Alert>
          )}
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      confirm={
        <Button
          onClick={() => deleteFile(fileId)}
          variant="destructive"
          disabled={isPending}
        >
          {isPending && <IconLoader className="animate-spin" />} Delete
        </Button>
      }
      cancel={<Button variant="secondary">Cancel</Button>}
    />
  );
}
