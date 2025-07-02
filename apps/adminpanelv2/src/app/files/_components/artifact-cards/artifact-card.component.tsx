'use client';

import { format } from 'date-fns';

import Link from 'next/link';

import {
  ArtifactoryEntity,
  ArtifactoryType
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { FileActionsDropdownComponent, FileIconComponent } from '../shared';

interface ArtifactCardComponentProps {
  file: ArtifactoryEntity;
}

export function ArtifactCardComponent({ file }: ArtifactCardComponentProps) {
  const { name, path, type, size, created_at: createdAt } = file;
  const isFolder = type === ArtifactoryType.FOLDER;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // const getStatusColor = () => {
  //   switch (status) {
  //     case 'active':
  //       return 'bg-green-100 text-green-800';
  //     case 'deleted':
  //       return 'bg-red-100 text-red-800';
  //     case 'archived':
  //       return 'bg-yellow-100 text-yellow-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // const getVisibilityColor = () => {
  //   switch (visibility) {
  //     case 'public':
  //       return 'bg-blue-100 text-blue-800';
  //     case 'private':
  //       return 'bg-gray-100 text-gray-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <FileIconComponent file={file} size="lg" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium truncate">
                {isFolder ? (
                  <Link href={`/files?folder=${path}`} className="hover:text-blue-600">
                    {name}
                  </Link>
                ) : (
                  <span className="hover:text-blue-600">{name}</span>
                )}
              </CardTitle>
            </div>
          </div>
          <FileActionsDropdownComponent file={file} showOnHover={true} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Size: {isFolder ? '--' : formatFileSize(size ?? 0)}</span>
            <span>{createdAt && format(new Date(createdAt), 'MMM dd, yyyy')}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* <Badge variant="secondary" className={`text-xs ${getStatusColor()}`}>
              {status}
            </Badge>
            <Badge variant="secondary" className={`text-xs ${getVisibilityColor()}`}>
              {visibility}
            </Badge> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
