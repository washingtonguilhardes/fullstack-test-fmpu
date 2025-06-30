import { PropsWithChildren } from 'react';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { AppHeaderGoBack } from './molecules/go-back';

export function SiteHeader(
  props: PropsWithChildren<{
    title: string;
    goBack?: string;
    goBackText?: string;
    className?: string;
  }>,
) {
  const { title, children, goBack, goBackText, className } = props;
  return (
    <header
      className={cn(
        'flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height]',
        'ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)',
        className,
      )}
    >
      <div className="flex w-full items-center gap-1 pl-4 lg:gap-2 lg:px-4">
        <SidebarTrigger className="-ml-1" />
        {goBack && <AppHeaderGoBack goBack={goBack} goBackText={goBackText} />}
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
