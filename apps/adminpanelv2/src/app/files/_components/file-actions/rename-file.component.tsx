import { useState } from 'react';

import { ConfirmationDialog } from '@/components/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconLoader } from '@tabler/icons-react';

export interface RenameFileComponentProps {
  filename: string;
  fileId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function RenameFileComponent(props: RenameFileComponentProps) {
  const { filename, fileId, open, setOpen } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [newFilename, setNewFilename] = useState(filename);

  const handleRename = () => {
    if (!newFilename.trim() || newFilename === filename) {
      return;
    }

    setIsLoading(true);
    console.log('rename', fileId, 'to', newFilename);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
    }, 2000);
  };

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
              disabled={isLoading}
            />
          </div>
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      confirm={
        <Button
          onClick={handleRename}
          disabled={isLoading || !newFilename.trim() || newFilename === filename}
        >
          {isLoading && <IconLoader className="animate-spin" />} Rename
        </Button>
      }
      cancel={<Button variant="secondary">Cancel</Button>}
    />
  );
}
