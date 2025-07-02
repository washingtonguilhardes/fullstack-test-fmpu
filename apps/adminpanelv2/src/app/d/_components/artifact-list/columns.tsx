'use client';

import { format } from 'date-fns';
import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

import Link from 'next/link';

import { FileEntity, FileType } from '@driveapp/contracts/entities/files/file.entity';

import { ConfirmationDialog } from '@/components/templates';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconEditCircle, IconFolder, IconLoader, IconTrash } from '@tabler/icons-react';
import { ColumnDef, Row } from '@tanstack/react-table';

import { TriggerComponent } from './trigger/trigger.component';

export const columns: ColumnDef<FileEntity>[] = [
  {
    id: 'navigator',
    header: '',
    cell: ({ row }) => {
      return <TriggerComponent file={row.original} />;
    },
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'visibility',
    header: 'Visibility',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row, getValue }) => {
      return <div>{format(new Date(getValue<string>()), 'dd/MM/yyyy')}</div>;
    },
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }: { row: Row<FileEntity> }) {
      const [open, setOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      return (
        <div className="flex items-center justify-end gap-2">
          <ConfirmationDialog
            title="Delete Artist"
            description="Are you sure you want to delete this artist?"
            message={
              <div>
                Are you sure you want to delete <b>{row.original.name}</b>?
              </div>
            }
            open={open}
            onOpenChange={setOpen}
            confirm={
              <Button
                onClick={() => {
                  setIsLoading(true);
                  console.log('delete', row);
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/d/artifacts/${row.original.id}`}>
                  <IconEditCircle /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
                <IconTrash /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
