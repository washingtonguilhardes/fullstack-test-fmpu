'use client';

import { SidebarInset } from '@/components/ui/sidebar';
import { FileSearchProviderImpl } from '@/context/file-search/file-search.context';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FileSearchProviderImpl>
      <SidebarInset className="p-4">
          {children}
      </SidebarInset>
    </FileSearchProviderImpl>
  );
}
