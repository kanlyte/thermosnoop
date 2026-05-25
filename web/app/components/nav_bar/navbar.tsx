"use client";

import { Bell, Menu } from "lucide-react";
import { Session } from "next-auth";
import { NavUser } from "@/components/nav-user";

export default function DashboardNavbar({
  session,
  onMenuClick,
}: {
  session: Session | null;
  onMenuClick?: () => void;
}) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-slate-900 md:text-2xl">
            Thermosnoop Farm Management
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="hidden min-w-[240px] md:block">
          <NavUser session={session} />
        </div>
      </div>
    </header>
  );
}