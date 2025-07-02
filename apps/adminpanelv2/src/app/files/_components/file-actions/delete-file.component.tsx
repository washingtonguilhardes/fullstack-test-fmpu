import { useState } from 'react';

import { ConfirmationDialog } from '@/components/templates';
import { Button } from '@/components/ui/button';
import { IconLoader } from '@tabler/icons-react';

export interface DeleteFileComponentProps {
  filename: string;
  fileId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DeleteFileComponent(props: DeleteFileComponentProps) {
  const { filename, fileId, open, setOpen } = props;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <ConfirmationDialog
      title="Delete File"
      description="Are you sure you want to delete this file?"
      message={
        <div>
          Are you sure you want to delete <b>{filename}</b>?
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      confirm={
        <Button
          onClick={() => {
            setIsLoading(true);
            console.log('delete', fileId);
            setTimeout(() => {
              setIsLoading(false);
            }, 4000);
          }}
          variant="destructive"
          disabled={isLoading}
        >
          {isLoading && <IconLoader className="animate-spin" />} Delete
        </Button>
      }
      cancel={<Button variant="secondary">Cancel</Button>}
    />
  );
}
