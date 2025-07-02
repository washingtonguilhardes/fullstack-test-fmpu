'use client';

import * as React from 'react';

import Link from 'next/link';

import { NavGroup } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@mui/material';
import {
  IconFile,
  IconFilePlus,
  IconFolder,
  IconShare
} from '@tabler/icons-react';


const data = {
  user: {
    name: 'Admin',
    email: 'admin@driveapp.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Files',
      url: '/d',
      icon: IconFile,
    },
    {
      title: 'Folders',
      url: '/d/folders',
      icon: IconFolder,
    },
    {
      title: 'Shared',
      url: '/d/shared',
      icon: IconShare,
    },
  ],

};

/*

Order
Subscription
Hire
Users
*/

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Button variant="text" size="small" className="w-full">
                <IconFilePlus /> Upload
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
