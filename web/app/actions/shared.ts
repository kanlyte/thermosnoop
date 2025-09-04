// farm-actions.ts
import { getFarmLogs, getFarmsPerUser } from "@/actions/farms";
import { Session } from 'next-auth';

export type MyFarm = {
  id: number;
  user_id: number;
  name: string;
  district: string;
  latitude: string;
  longtude: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
  thermoStress?: string;
  discomfortLevel: string;
  recommendation: string;
  humidity?: string;
  temperature?: number;
  hr_thermoStress: string;
  hr_discomfortLevel: string;
  hr_recommendation: string;
  hourly_temp: string;
  hourly_hum: string;
  daily_temp: string;
  daily_hum: string;
  daily_thermoStress: string;
  daily_discomfortLevel: string;
  daily_recommendation: string;
  weekly_temp: string;
  weekly_hum: string;
  weekly_thermoStress: string;
  weekly_discomfortLevel: string;
  weekly_recommendation: string;
};

export async function fetchUserFarms(session: Session): Promise<{ farms: MyFarm[] | null, error: string | null }> {
  if (!session?.user?.id) {
    return { farms: null, error: "No user session found" };
  }

  try {
    const response = await getFarmsPerUser(session.user.id, session.accessToken as string);

    if (response.success) {
      const enrichedFarms = await Promise.all(
        response.result.map(async (farm: MyFarm) => {
          let logsData = null;
          try {
            const logsResponse = await getFarmLogs(farm.id.toString());
            if (logsResponse.success && logsResponse.result.length > 0) {
              logsData = logsResponse.result[0];
            }
          } catch (err) {
            console.error(`Farm logs fetch failed for farm ${farm.id}`, err);
          }

          return {
            ...farm,
            location: farm.district,
            image: `https://picsum.photos/seed/${farm.id}/300/200`,
            thermoStress: logsData?.thermoStress ? Math.round(logsData.thermoStress) : "N/A",
            discomfortLevel: logsData?.discomfortLevel ?? "N/A",
            recommendation: logsData?.recommendation ?? "N/A",
          };
        })
      );
      
      // Sort farms by createdAt date in descending order (newest first)
      const sortedFarms = enrichedFarms.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      return { farms: sortedFarms, error: null };
    } else {
      return { farms: null, error: response.error || "Failed to fetch farms" };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { farms: null, error: "An unexpected error occurred" };
  }
}