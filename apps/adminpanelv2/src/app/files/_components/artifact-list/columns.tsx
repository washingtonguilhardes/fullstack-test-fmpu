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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconEditCircle, IconFolder, IconLoader, IconTrash } from '@tabler/icons-react';
import { ColumnDef, Row } from '@tanstack/react-table';

import { FileDropdownActionsComponent } from '../file-actions/file-dropdown-actions.component';
import { TriggerComponent } from './trigger/trigger.component';

export const columns: ColumnDef<FileEntity>[] = [
  {
    id: 'navigator',
    header: '',
    cell: ({ row }) => {
      return <TriggerComponent file={row.original} />;
    }
  },
  {
    accessorKey: 'size',
    header: 'Size'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'visibility',
    header: 'Visibility'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row, getValue }) => {
      return <div>{format(new Date(getValue<string>()), 'dd/MM/yyyy')}</div>;
    }
  },
  {
    id: 'actions',
    cell: FileDropdownActionsComponent
  }
];
