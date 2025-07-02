import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { IArtistOutputDto } from '@vocalfy/contracts/dtos';

import { getChangedFields } from '@/lib/utils';

export const useUnsavedChanges = (artist?: IArtistOutputDto) => {
  const { control } = useFormContext();

  const values = useWatch({ control });

  const isChanged = useMemo(() => {
    if (!artist) return true;
    const changedFields = getChangedFields(
      { ...values, products: undefined },
      { ...artist, products: undefined },
    );
    console.log({ changedFields, values });
    return Object.keys(changedFields).length > 0;
  }, [values, artist]);

  return { isChanged };
};
