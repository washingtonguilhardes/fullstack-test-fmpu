'use client';

import { format } from 'date-fns';

import {
  ArtifactoryEntity,
  ArtifactoryType
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryDto } from '@driveapp/contracts/entities/artifactory/dtos/artifactory.dto';
import { FileDto } from '@driveapp/contracts/entities/artifactory/dtos/file.dto';
import { FolderDto } from '@driveapp/contracts/entities/artifactory/dtos/folder.dto';

import { ColumnDef } from '@tanstack/react-table';

import { FileDropdownActionsComponent } from '../file-actions/file-dropdown-actions.component';
import { TriggerComponent } from './trigger/trigger.component';

export const columns: ColumnDef<ArtifactoryDto>[] = [
  {
    id: 'navigator',
    header: '',
    cell: ({ row }) => {
      return <TriggerComponent file={row.original as FileDto} />;
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
