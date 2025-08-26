import AddFarmForm from "@/components/farm/AddFarmForm";
import { auth } from "@/auth";


const AddFarmPage = async () =>  {
    const session = await auth();

    if (!session) {
      return <div>You must be logged in to add a farm.</div>;
    }
    
    return (
      <AddFarmForm session={session} />
    );
}

export default AddFarmPage;