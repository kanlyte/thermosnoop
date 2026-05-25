"use client";

import { useState } from "react";
import { Session } from "next-auth";

import AppSidebar from "@/components/Sidebar";
import DashboardNavbar from "@/components/nav_bar/navbar";

export default function DashboardShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#f7f8fa]">
      <AppSidebar
        session={session}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen md:ml-[220px] lg:ml-[280px]">
        <DashboardNavbar
          session={session}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="bg-[#f7f8fa] p-4">{children}</main>
      </div>
    </div>
  );
}