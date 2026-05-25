import AddFarmForm from "@/components/farm/AddFarmForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AddFarmPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return <AddFarmForm session={session} />;
};

export default AddFarmPage;