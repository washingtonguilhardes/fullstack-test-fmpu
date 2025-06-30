'use client';

import { SVGProps } from 'react';

import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from '@tabler/icons-react';

type NavItem = {
  name: string;
  url: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>> | Icon;
  actions?: Omit<NavItem, 'actions'>[];
};

type NavGroupProps = {
  label: string;
  items: Partial<NavItem>[];
};

export function NavGroup({ label, items }: NavGroupProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                {item.icon ? <item.icon /> : null}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            {item.actions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent rounded-sm"
                  >
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  {item.actions.map(action => (
                    <Link href={action.url} passHref key={`${item.name}-${action.name}`}>
                      <DropdownMenuItem>
                        <action.icon />
                        <span>{action.name}</span>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  <Link href={item.url ?? '#'} passHref target="_blank">
                    <DropdownMenuItem>
                      <IconFolder />
                      <span>Open (new tab)</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        ))}
        {/* {false && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <IconDots className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )} */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
