'use client';

import { createContext, useContext, useState } from "react";

const FileSearchContext = createContext<{
  segment: string;
  search: string;
  setSearch: (search: string) => void;
  setSegment: (segment: string) => void;
}>({
  segment: '',
  search: '',
  setSearch: () => {},
  setSegment: () => {},
});

export const useFileSearch = () => {
  return useContext(FileSearchContext);
};

export const FileSearchProviderImpl = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');

  return (
    <FileSearchContext.Provider value={{ search, setSearch, segment, setSegment }}>
      {children}
    </FileSearchContext.Provider>
  );
};
