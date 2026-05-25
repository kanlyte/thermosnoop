"use client";

import { Bell } from "lucide-react";
import { Session } from "next-auth";
import { NavUser } from "@/components/nav-user";

export default function DashboardNavbar({
  session,
}: {
  session: Session | null;
}) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-[20px] font-semibold text-slate-900 md:text-2xl">
          Thermosnoop Analytics Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-5">
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