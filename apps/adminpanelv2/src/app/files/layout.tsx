import { SiteHeader } from '@/components/site-header';
import { Input } from '@/components/ui/input';
import { FileSearchProviderImpl } from '@/context/file-search/file-search.context';
import { IconSearch } from '@tabler/icons-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FileSearchProviderImpl>
      <SiteHeader>
        <div className="flex items-center justify-center md:justify-end w-full ">
          <button className="flex cursor-pointer items-center gap-2 bg-slate-900  rounded-full p-3 md:px-4 md:py-2  group hover:bg-slate-800  transition-all duration-300 text-muted-foreground ">
            <IconSearch className="h-4 w-4" />
            <div className="flex items-center gap-2 group-hover:w-auto  transition-all  text-sm text-white hidden md:block">
              Search
            </div>
          </button>
        </div>
      </SiteHeader>
      <div className="flex-1 p-6">{children}</div>
    </FileSearchProviderImpl>
  );
}
