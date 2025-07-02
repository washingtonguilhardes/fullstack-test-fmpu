import { IArtistOutputDto } from '@vocalfy/contracts/dtos';

import { Button } from '@/components/ui/button';
import { IconAlertCircle } from '@tabler/icons-react';

import { useUnsavedChanges } from './unsaved-changes.hooks';

export const UnsavedChangesAlert = (props: {
  artist: IArtistOutputDto;
  reset: () => void;
}) => {
  const { artist, reset } = props;
  const { isChanged } = useUnsavedChanges(artist);

  return isChanged ? (
    <div className="text-md text-amber-400 p-1 rounded-md bg-amber-500/10 flex items-center gap-2 mr-1">
      <IconAlertCircle size={24} />
      Unsaved changes
      <Button
        variant="secondary"
        size="sm"
        className="text-sm bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:text-amber-500"
        onClick={() => {
          reset();
        }}
      >
        Undo
      </Button>
    </div>
  ) : null;
};
