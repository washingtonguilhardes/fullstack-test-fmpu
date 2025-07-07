'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  IconPlus,
  IconChevronDown,
  IconFile,
  IconFolder,
  IconFilePlus,
  IconFolderPlus
} from '@tabler/icons-react';

export type ActionType = 'file' | 'folder';

interface CompoundActionButtonProps {
  onAction: (action: ActionType) => void;
  className?: string;
}

const STORAGE_KEY = 'last-used-action';

export function CompoundActionButton({ onAction, className }: CompoundActionButtonProps) {
  const [lastUsedAction, setLastUsedAction] = useState<ActionType>('file');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load last used action from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'file' || stored === 'folder') {
      setLastUsedAction(stored);
    }
  }, []);

  const handleAction = (action: ActionType) => {
    localStorage.setItem(STORAGE_KEY, action);
    setLastUsedAction(action);
    setIsOpen(false);
    onAction(action);
  };

  const getActionIcon = (action: ActionType) => {
    return action === 'file' ? <IconFilePlus size={16} /> : <IconFolderPlus size={16} />;
  };

  const getActionLabel = (action: ActionType) => {
    return action === 'file' ? 'New File' : 'New Folder';
  };

  return (
    <div className="relative border rounded-md overflow-hidden p-[2px] w-full flex justify-between">
      <Button
        variant="ghost"
        className={cn(className, 'flex-1 justify-start')}
        onClick={() => handleAction(lastUsedAction)}
      >
        {getActionIcon(lastUsedAction)}
        {getActionLabel(lastUsedAction)}
      </Button>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={className}
            onClick={() => setIsOpen(true)}
          >
            <IconChevronDown size={16} className="ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => handleAction('file')}
            className="flex items-center gap-2"
          >
            {getActionIcon('file')}
            New File
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction('folder')}
            className="flex items-center gap-2"
          >
            {getActionIcon('folder')}
            New Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
