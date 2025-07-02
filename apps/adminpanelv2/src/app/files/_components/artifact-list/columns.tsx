'use client';

import { format } from 'date-fns';

import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { ColumnDef } from '@tanstack/react-table';

import { FileDropdownActionsComponent } from '../file-actions/file-dropdown-actions.component';
import { TriggerComponent } from './trigger/trigger.component';

export const columns: ColumnDef<ArtifactoryEntity>[] = [
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
    cell: ({ getValue }) => {
      const value = getValue<string>();
      if (!value) return <div>--</div>;
      return <div>{format(new Date(value), 'dd/MM/yyyy')}</div>;
    }
  },
  {
    id: 'actions',
    cell: FileDropdownActionsComponent
  }
];
