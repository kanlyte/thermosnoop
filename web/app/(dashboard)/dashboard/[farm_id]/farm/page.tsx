import { Session } from 'next-auth'
import { getFarmLogs, getFarmsPerUser } from "@/actions/farms"
import FarmDetailClient from '@/components/dashboard/FarmDetailClient';
import { auth } from '@/auth';

interface FarmDetailPageProps {
  params: Promise<{ farm_id: string }>;
}

export default async function FarmDetailPage({ 
  params 
}: FarmDetailPageProps) {
  const { farm_id } = await params;
  const session = await auth();

  console.log("Fetching data for farm_id:", farm_id);

  try {
    // Check if session is null
    if (!session || !session.user || !session.accessToken) {
      throw new Error("User session not found. Please log in.");
    }
    // Fetch farm data
    const farmsResponse = await getFarmsPerUser(session.user.id, session.accessToken as string)
    console.log("Current User:", session.user);
    
    if (!farmsResponse.success) {
      throw new Error(farmsResponse.error || "Failed to fetch farm data")
    }

    // Find the specific farm
    const foundFarm = farmsResponse.result.find((f: any) => f.id.toString() === farm_id)
    
    if (!foundFarm) {
      throw new Error("Farm not found")
    }

    // Get weather logs
    let logsData = null;
    try {
      const logsResponse = await getFarmLogs(farm_id);
      if (logsResponse.success && logsResponse.result.length > 0) {
        logsData = logsResponse.result[0];
      }
    } catch (err) {
      console.error(`Farm logs fetch failed for farm ${farm_id}`, err);
    }

    // Prepare the data for the client component
    const farmData = {
      ...foundFarm,
      location: foundFarm.district,
      image: `https://picsum.photos/seed/${foundFarm.id}/600/400`,
      thermoStress: logsData?.thermoStress ? Math.round(logsData.thermoStress) : "N/A",
      discomfortLevel: logsData?.discomfortLevel ?? "N/A",
      hr_thermoStress: logsData?.hr_thermoStress ?? "N/A",
      hr_discomfortLevel: logsData?.hr_discomfortLevel ?? "N/A",
      recommendation: logsData?.recommendation ?? "N/A",
      hr_recommendation: logsData?.hr_recommendation ?? "N/A",
      daily_temp: logsData?.daily_temp ?? "N/A",
      daily_hum: logsData?.daily_hum ?? "N/A",
      weekly_temp: logsData?.weekly_temp ?? "N/A",
      weekly_hum: logsData?.weekly_hum ?? "N/A",
    }
    console.log("Farm data prepared for client:", farmData);

    return <FarmDetailClient session={session} initialFarm={farmData} />

  } catch (error) {
    // Pass error to client component
    return <FarmDetailClient 
      session={session} 
      initialFarm={null} 
      error={error instanceof Error ? error.message : "An unexpected error occurred"}
    />
  }
}