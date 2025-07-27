import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { SignOutButton } from './SignOutButton';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { usePathname } from 'next/navigation'
export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

  const pathname = usePathname()
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm" isActive={pathname === item.title}>
              <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
              </Link>
                
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SignOutButton className='w-full bg-background  text-primary border-primary border hover:text-black'>
                            <span>Sign out</span>
                        </SignOutButton>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
