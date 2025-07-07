'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryDto } from '@driveapp/contracts/entities/artifactory/dtos/artifactory.dto';
import { FileDto } from '@driveapp/contracts/entities/artifactory/dtos/file.dto';

export enum FileAction {
  RENAME = 'rename',
  MOVE = 'move',
  DELETE = 'delete',
  DOWNLOAD = 'download'
}

interface FileActionContextType {
  selectedFile: FileDto | null;
  currentAction: FileAction | null;
  isActionOpen: boolean;
  openAction: (action: FileAction, file: FileDto) => void;
  closeAction: () => void;
}

const FileActionContext = createContext<FileActionContextType | undefined>(undefined);

interface FileActionProviderProps {
  children: ReactNode;
}

export function FileActionProvider({ children }: FileActionProviderProps) {
  const [selectedFile, setSelectedFile] = useState<FileDto | null>(null);
  const [currentAction, setCurrentAction] = useState<FileAction | null>(null);
  const [isActionOpen, setIsActionOpen] = useState(false);

  const openAction = (action: FileAction, file: FileDto) => {
    setSelectedFile(file);
    setCurrentAction(action);
    setIsActionOpen(true);
  };

  const closeAction = () => {
    setSelectedFile(null);
    setCurrentAction(null);
    setIsActionOpen(false);
  };

  const value: FileActionContextType = {
    selectedFile,
    currentAction,
    isActionOpen,
    openAction,
    closeAction
  };

  return (
    <FileActionContext.Provider value={value}>{children}</FileActionContext.Provider>
  );
}

export function useFileActions() {
  const context = useContext(FileActionContext);
  if (context === undefined) {
    throw new Error('useFileActions must be used within a FileActionProvider');
  }
  return context;
}
