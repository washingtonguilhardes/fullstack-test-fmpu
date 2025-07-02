'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import { FileEntity } from '@driveapp/contracts/entities/files/file.entity';

export enum FileAction {
  RENAME = 'rename',
  MOVE = 'move',
  SHARE = 'share',
  DELETE = 'delete',
  DOWNLOAD = 'download'
}

interface FileActionContextType {
  selectedFile: FileEntity | null;
  currentAction: FileAction | null;
  isActionOpen: boolean;
  openAction: (action: FileAction, file: FileEntity) => void;
  closeAction: () => void;
  executeAction: (action: FileAction, file: FileEntity) => void;
}

const FileActionContext = createContext<FileActionContextType | undefined>(undefined);

interface FileActionProviderProps {
  children: ReactNode;
}

export function FileActionProvider({ children }: FileActionProviderProps) {
  const [selectedFile, setSelectedFile] = useState<FileEntity | null>(null);
  const [currentAction, setCurrentAction] = useState<FileAction | null>(null);
  const [isActionOpen, setIsActionOpen] = useState(false);

  const openAction = (action: FileAction, file: FileEntity) => {
    setSelectedFile(file);
    setCurrentAction(action);
    setIsActionOpen(true);
  };

  const closeAction = () => {
    setSelectedFile(null);
    setCurrentAction(null);
    setIsActionOpen(false);
  };

  const executeAction = (action: FileAction, file: FileEntity) => {
    console.log(`Executing action: ${action} on file: ${file.name}`);

    // Here you would implement the actual action logic
    switch (action) {
      case FileAction.RENAME:
        // Handle rename logic
        console.log('Renaming file:', file.name);
        break;
      case FileAction.MOVE:
        // Handle move logic
        console.log('Moving file:', file.name);
        break;
      case FileAction.SHARE:
        // Handle share logic
        console.log('Sharing file:', file.name);
        break;
      case FileAction.DELETE:
        // Handle delete logic
        console.log('Deleting file:', file.name);
        break;
      case FileAction.DOWNLOAD:
        // Handle download logic
        console.log('Downloading file:', file.name);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const value: FileActionContextType = {
    selectedFile,
    currentAction,
    isActionOpen,
    openAction,
    closeAction,
    executeAction
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
