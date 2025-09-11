import { auth } from "@/auth";
import FarmsList from "@/components/dashboard/DashboardPage"
import { redirect } from "next/dist/client/components/navigation";

async function DashboardHome() {
    const session = await auth();
    if (!session?.user.id) {
        redirect("/auth/login");
    }
    console.log("Debugging purpose:", session.refreshToken);
  return (
    <div>
      <FarmsList session={session} />
      
    </div>
  )
}

export default DashboardHome