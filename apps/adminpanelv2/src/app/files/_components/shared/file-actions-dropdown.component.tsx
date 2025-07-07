'use client';

import { MoreHorizontalIcon } from 'lucide-react';

import { FileDto } from '@driveapp/contracts/entities/artifactory/dtos/file.dto';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  IconDownload,
  IconEdit,
  IconFolder,
  IconShare,
  IconTrash
} from '@tabler/icons-react';

import { FileAction, useFileActions } from '../file-actions/file-actions.context';

interface FileActionsDropdownComponentProps {
  file: FileDto;
  className?: string;
  showOnHover?: boolean;
}

export function FileActionsDropdownComponent({
  file,
  className = '',
  showOnHover = false
}: FileActionsDropdownComponentProps) {
  const { openAction } = useFileActions();

  const handleAction = (action: FileAction) => {
    openAction(action, file);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 w-8 p-0 ${showOnHover ? 'opacity-100 md:opacity-0 group-hover:opacity-100  transition-opacity' : ''} ${className}`}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleAction(FileAction.DOWNLOAD)}>
          <IconDownload className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(FileAction.RENAME)}>
          <IconEdit className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(FileAction.MOVE)}>
          <IconFolder className="mr-2 h-4 w-4" />
          Move
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => handleAction(FileAction.DELETE)}
        >
          <IconTrash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
