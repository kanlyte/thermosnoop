"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { Bell} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

const DashboardNavbar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
    }

    const clearSearch = () => {
      setSearchQuery('')
    }

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left section - Sidebar trigger and search */}
                <div className="flex flex-1 items-center gap-4">
                    <SidebarTrigger className="md:hidden" />
                </div>

                {/* Right section - Navigation icons and user menu */}
                <div className={`flex items-center gap-4 ${(isSearchFocused || searchQuery) ? 'max-md:hidden' : ''}`}>
                    <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:bg-muted/50"
                        >
                          <Bell className="h-5 w-5" />
                          <span className="sr-only">Notifications</span>
                        </Button>
                    </div>

                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="relative h-9 w-9 rounded-full hover:bg-muted/50"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                                    <AvatarFallback>GU</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="w-56" 
                          align="end" 
                          forceMount
                        >
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Guest</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        guest@example.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                            Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}

export default DashboardNavbar