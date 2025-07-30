"use client"
import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { filterRoutes } from '@/lib/nav_routes/filterRoutes';
import { NavUser } from '@/components/nav-user';
import { Session } from 'next-auth';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { cn } from '@/lib/utils';

const AppSidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const { navMain} = filterRoutes('user');

  const navMainWithActive = navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url || 
      item.items?.some((nestedItem) => nestedItem.url === pathname),
    items: item.items?.map((nestedItem) => ({
      ...nestedItem,
      isActive: pathname === nestedItem.url,
    })),
  }));
  // const data = {
  //   user: {
  //     name: 'Guest',
  //     email: 'guest@example.com',
  //     avatar: '/avatars/shadcn.jpg',
  //   },
  // };

  return (
    <Sidebar className="z-10 border-r bg-gradient-to-b from-background to-muted/20">
      <SidebarHeader className="px-4 py-3 border-b">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative size-8 rounded-lg overflow-hidden">
            <Image 
              src="/logo.webp" 
              alt="Logo" 
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-primary">Thermosnoop</span>
            <span className="text-xs text-muted-foreground">Analytics Dashboard</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 py-4">
        <div className="space-y-1">
          <NavMain items={navMainWithActive} />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;