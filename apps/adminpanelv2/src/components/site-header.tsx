import { PropsWithChildren } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { IconLogout, IconUserCircle } from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

function AccountDetails(props: { name: string; email: string; avatar: string }) {
  const { avatar, email, name } = props;
  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        <span className="text-muted-foreground truncate text-xs">{email}</span>
      </div>
    </div>
  );
}

export function SiteHeader(
  props: PropsWithChildren<{
    className?: string;
  }>
) {
  const { children, className } = props;

  const user = {
    name: 'Admin',
    email: 'admin@vocalfy.com',
    avatar: '/avatars/shadcn.jpg'
  };
  return (
    <header className={cn('flex h-16 shrink-0 items-center gap-2 border-b', className)}>
      <div className="flex w-full items-center gap-1 pl-4 lg:gap-2 lg:px-4">
        <h1 className="text-base font-medium">DriveApp</h1>
        <div className="flex-1 flex items-center justify-center">{children}</div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'h-12 text-sm group-data-[collapsible=icon]:p-0!',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 cursor-pointer h-12 text-sm group-data-[collapsible=icon]:p-0! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <AccountDetails
                  avatar={user.avatar}
                  email={user.email}
                  name={user.name}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">
                  <IconUserCircle />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/api/logout">
                  <IconLogout />
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
