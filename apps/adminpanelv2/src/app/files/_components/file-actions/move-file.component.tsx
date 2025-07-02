import { useState } from 'react';

import { ConfirmationDialog } from '@/components/templates';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { IconLoader } from '@tabler/icons-react';

export interface MoveFileComponentProps {
  filename: string;
  fileId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MoveFileComponent(props: MoveFileComponentProps) {
  const { filename, fileId, open, setOpen } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  // Mock folders data - in real app this would come from API
  const folders = [
    { id: '1', name: 'Documents' },
    { id: '2', name: 'Images' },
    { id: '3', name: 'Videos' },
    { id: '4', name: 'Music' }
  ];

  const handleMove = () => {
    if (!selectedFolderId) {
      return;
    }

    setIsLoading(true);
    console.log('move', fileId, 'to folder', selectedFolderId);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
    }, 2000);
  };

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
              <SelectTrigger>
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map(folder => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Moving: <b>{filename}</b>
          </div>
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      confirm={
        <Button onClick={handleMove} disabled={isLoading || !selectedFolderId}>
          {isLoading && <IconLoader className="animate-spin" />} Move
        </Button>
      }
      cancel={<Button variant="secondary">Cancel</Button>}
    />
  );
}
