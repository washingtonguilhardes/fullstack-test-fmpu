'use client';

import * as React from 'react';

import Image from 'next/image';
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
import {
  IconArtboard,
  IconChartBar,
  IconDashboard,
  IconDiscount,
  IconListDetails,
  IconMusic,
  IconPlus,
  IconReport,
  IconSettings,
  IconShieldLock,
  IconShoppingCart,
  IconStar,
} from '@tabler/icons-react';

import { VcfCreditCardRefreshIcon } from './icons/payment/credit-card-refresh.icon';
import { VcfUsersIcon } from './icons/users/users.icon';

const data = {
  user: {
    name: 'Admin',
    email: 'admin@driveapp.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/d/start',
      icon: IconDashboard,
    },
  ],
  settings: [
    // {
    //   name: 'Settings',
    //   url: '/s/',
    //   icon: IconSettings,
    // },
    {
      name: 'Genres',
      url: '/s/genres',
      icon: IconMusic,
    },
  ],
  content: [
    {
      name: 'Artists',
      url: '/d/artists',
      icon: IconArtboard,
      actions: [
        {
          name: 'New Artist',
          url: '/d/artists/new',
          icon: IconPlus,
        },
      ],
    },
    {
      name: 'Reviews',
      url: '/d/reviews',
      icon: IconStar,
    },
    {
      name: 'Vocals',
      url: '/d/vocals',
      icon: IconMusic,
      actions: [
        {
          name: 'New Vocal',
          url: '/d/vocals/new',
          icon: IconPlus,
        },
      ],
    },
    {
      name: 'Lists',
      url: '/d/lists',
      icon: IconListDetails,
    },
  ],
  admin: [
    {
      name: 'Users',
      url: '/a/users',
      icon: VcfUsersIcon,
    },
    {
      name: 'Roles',
      url: '/a/roles',
      icon: IconShieldLock,
    },
  ],
  sales: [
    {
      name: 'Orders',
      url: '/s/orders',
      icon: IconShoppingCart,
    },
    {
      name: 'Subscriptions',
      url: '/s/subscriptions',
      icon: VcfCreditCardRefreshIcon,
    },
    {
      name: 'Coupons',
      url: '/s/coupons',
      icon: IconDiscount,
    },
    {
      name: 'Hires',
      url: '/s/hires',
      icon: IconChartBar,
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
              <Link href="/d/start">
                <Image
                  src="/driveapp-logo.png"
                  alt="Driveapp"
                  width={256 / 2.5}
                  height={68 / 2.5}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavGroup label="Content" items={data.content} />
        <NavGroup label="Sales" items={data.sales} />
        <NavGroup label="Admin" items={data.admin} />
        <NavGroup label="Settings" items={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
