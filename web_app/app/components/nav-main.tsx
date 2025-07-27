"use client"

import { ChevronDown, type LucideIcon } from "lucide-react"
import { usePathname } from 'next/navigation'
import Link from "next/link"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="space-y-1">
      <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
        Navigation
      </SidebarGroupLabel>
      
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem className="group">
              <CollapsibleTrigger
                asChild
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  item.isActive 
                    ? "bg-green-200 text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    item.isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.items?.length ? (
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      "group-data-[state=open]:rotate-180",
                      item.isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                  ) : null}
                </div>
              </CollapsibleTrigger>
              
              {item.items?.length ? (
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="ml-9 mt-1 space-y-1 pl-2">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.url}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          pathname === subItem.url
                            ? "bg-primary/5 text-primary font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        <span className="relative before:absolute before:-left-2 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-current before:opacity-0 before:transition-opacity before:content-[''] hover:before:opacity-30">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}