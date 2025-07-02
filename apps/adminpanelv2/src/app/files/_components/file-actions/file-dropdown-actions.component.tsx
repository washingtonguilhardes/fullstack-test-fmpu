import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

import { FileEntity } from '@driveapp/contracts/entities/files/file.entity';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconFolder, IconPencil, IconShare, IconTrash } from '@tabler/icons-react';
import { Row } from '@tanstack/react-table';

import { DeleteFileComponent } from './delete-file.component';
import { MoveFileComponent } from './move-file.component';
import { RenameFileComponent } from './rename-file.component';
import { ShareFileComponent } from './share-file.component';

export function FileDropdownActionsComponent(props: { row: Row<FileEntity> }) {
  const { row } = props;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <DeleteFileComponent
        filename={row.original.name}
        fileId={row.original.id}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />
      <RenameFileComponent
        filename={row.original.name}
        fileId={row.original.id}
        open={isRenameOpen}
        setOpen={setIsRenameOpen}
      />
      <MoveFileComponent
        filename={row.original.name}
        fileId={row.original.id}
        open={isMoveOpen}
        setOpen={setIsMoveOpen}
      />
      <ShareFileComponent
        filename={row.original.name}
        fileId={row.original.id}
        open={isShareOpen}
        setOpen={setIsShareOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
            <IconPencil /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsMoveOpen(true)}>
            <IconFolder /> Move
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsShareOpen(true)}>
            <IconShare /> Share
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <IconTrash /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
