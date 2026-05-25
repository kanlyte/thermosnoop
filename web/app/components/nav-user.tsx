"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Settings, LogOut, UserRound, ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function getInitials(name?: string | null) {
  if (!name) return "GU";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function NavUser({ session }: { session: Session | null }) {
  if (!session?.user) {
    return (
      <Button variant="ghost" asChild>
        <a href="/auth/login">Sign In</a>
      </Button>
    );
  }

  const initials = getInitials(session.user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-slate-100">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarImage
              src={"/avatars/shadcn.jpg"}
              alt={session.user.name || "User"}
            />
            <AvatarFallback className="bg-slate-100 text-sm font-semibold text-slate-700">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {session.user.name || "Guest User"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {session.user.email}
            </p>
          </div>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={"/avatars/shadcn.jpg"}
                alt={session.user.name || "User"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {session.user.name || "Guest User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/dashboard/profile" className="cursor-pointer">
            <UserRound className="mr-2 h-4 w-4" />
            Profile
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/dashboard/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}