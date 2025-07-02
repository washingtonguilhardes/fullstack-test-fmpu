'use client';

import { Button } from '@/components/ui/button';
import { IconLayoutGrid, IconTable } from '@tabler/icons-react';

export type ViewMode = 'table' | 'grid';

interface ViewToggleComponentProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggleComponent({
  viewMode,
  onViewModeChange
}: ViewToggleComponentProps) {
  return (
    <div className="flex items-center space-x-1 rounded-md border p-1">
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className="h-8 w-8 p-0"
      >
        <IconTable className="h-4 w-4" />
        <span className="sr-only">Table view</span>
      </Button>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="h-8 w-8 p-0"
      >
        <IconLayoutGrid className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
    </div>
  );
}
