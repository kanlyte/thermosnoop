import AddFarmForm from "@/components/farm/AddFarmForm";
import GoogleMapsLoader from "@/components/farm/GoogleMapsLoader";
import { auth } from "@/auth";

const AddFarmPage = async () =>  {
    const session = await auth();

    if (!session) {
      return <div>You must be logged in to add a farm.</div>;
    }
    
    return (
      <GoogleMapsLoader>
        <AddFarmForm session={session} />
      </GoogleMapsLoader>
    );
}

export default AddFarmPage;