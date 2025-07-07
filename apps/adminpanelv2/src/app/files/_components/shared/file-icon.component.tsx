'use client';

import { useMemo } from 'react';

import {
  ArtifactoryEntity,
  ArtifactoryType
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryDto } from '@driveapp/contracts/entities/artifactory/dtos/artifactory.dto';

import {
  IconArchive,
  IconFile,
  IconFileText,
  IconFolder,
  IconMusic,
  IconPhoto,
  IconVideo
} from '@tabler/icons-react';

interface FileIconComponentProps {
  file: ArtifactoryDto;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'h-4 w-4';
    case 'md':
      return 'h-6 w-6';
    case 'lg':
      return 'h-8 w-8';
    default:
      return 'h-6 w-6';
  }
};

export function FileIconComponent({
  file,
  size = 'md',
  className = ''
}: FileIconComponentProps) {
  const { name, type } = file;

  return useMemo(() => {
    const isFolder = type === ArtifactoryType.FOLDER;

    if (isFolder) {
      return (
        <IconFolder className={`${getSizeClasses(size)} text-blue-500 ${className}`} />
      );
    }

    const extension = name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
      case 'bmp':
      case 'tiff':
        return (
          <IconPhoto className={`${getSizeClasses(size)} text-green-500 ${className}`} />
        );
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf':
      case 'odt':
        return (
          <IconFileText className={`${getSizeClasses(size)} text-red-500 ${className}`} />
        );
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
      case 'mkv':
        return (
          <IconVideo className={`${getSizeClasses(size)} text-purple-500 ${className}`} />
        );
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
      case 'm4a':
        return (
          <IconMusic className={`${getSizeClasses(size)} text-orange-500 ${className}`} />
        );
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
      case 'bz2':
        return (
          <IconArchive className={`${getSizeClasses(size)} text-gray-500 ${className}`} />
        );
      default:
        return (
          <IconFile className={`${getSizeClasses(size)} text-gray-500 ${className}`} />
        );
    }
  }, [name, type, size, className]);
}
