import { ReactNode } from "react";
import { redirect } from "next/navigation";

import AppSidebar from "@/components/Sidebar";
import DashboardNavbar from "@/components/nav_bar/navbar";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f8fa]">
      {/* Sidebar */}
      <AppSidebar session={session} />

      {/* Main Content */}
      <div className="min-h-screen md:ml-[220px] lg:ml-[280px]">
        <DashboardNavbar session={session} />

        <main className="bg-[#f7f8fa] p-4">
          {children}
        </main>
      </div>
    </div>
  );
}