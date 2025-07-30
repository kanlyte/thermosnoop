
import Image from "next/image";
import Link from "next/link";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/Sidebar"
import DashboardNavbar from "@/components/nav_bar/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  console.log("Session in Dashboard Layout now:", session);     

  // redirect if session is null
  if (!session?.user.id) {
    redirect("/auth/login");
  }

  // const roleCheckResult = await loginRoleChecks(session);


  // if (roleCheckResult.needsProfileCreation) {
  //   redirect("/onboarding");
  // }

  return (
      <SidebarProvider>
        <AppSidebar session={session}/>
        <main className="w-full bg-sidebar-accent">
          <DashboardNavbar/>
          <div className="p-4 md:gap-8 md:p-4" >
            {children}
          </div>
        </main>
      </SidebarProvider>
  );


}
