'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { FolderDto } from '@driveapp/contracts/entities/artifactory/dtos/folder.dto';

import { restClient } from '@/lib/http/rest.client';
import { useQuery } from '@tanstack/react-query';

import { useAccount } from '../account/account.context';

const FileSearchContext = createContext<{
  segment: string;
  search: string;
  setSearch: (search: string) => void;
  setSegment: (segment: string) => void;
  folder?: FolderDto | null;
  fetchFolder: (folderPath?: string) => void;
}>({
  segment: '',
  search: '',
  setSearch: () => {},
  setSegment: () => {},
  folder: undefined,
  fetchFolder: () => {}
});

export const useFileSearch = () => {
  const context = useContext(FileSearchContext);

  if (!context) {
    throw new Error('useFileSearch must be used within a FileSearchProvider');
  }

  return context;
};

export const FileSearchProviderImpl = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAccount();
  const searchParams = useSearchParams();
  const [segment, setSegment] = useState<string>(searchParams.get('segment') || '');

  const [search, setSearch] = useState('');

  const { data: folder, refetch } = useQuery({
    queryKey: ['folder', segment],
    queryFn: () =>
      restClient
        .get<FolderDto>(`/artifactory/folder?path=${segment}`)
        .then(res => res.data),
    enabled: !!segment
  });

  const fetchFolder = useCallback(
    async (folderPath?: string) => {
      if (folderPath) {
        setSegment(folderPath);
      }
      await refetch();
    },
    [refetch]
  );

  return (
    <FileSearchContext.Provider
      value={{ search, setSearch, segment, setSegment, fetchFolder, folder }}
    >
      {children}
    </FileSearchContext.Provider>
  );
};
