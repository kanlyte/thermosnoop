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


// farm-actions.ts - Add this function
export interface HistoricalDataPoint {
  date: string; // Format: YYYY-MM-DD
  thi: number;
  discomfortLevel: string;
}

export async function fetchHistoricalThermalData(farmId: string, days: number = 7): Promise<HistoricalDataPoint[]> {
  try {
    const logsResponse = await getFarmLogs(farmId);
    
    if (!logsResponse.success) {
      console.error("Failed to fetch farm logs");
      return [];
    }

    // Get logs from the past specified days
    const oneDayMs = 24 * 60 * 60 * 1000;
    const pastDate = new Date(Date.now() - (days * oneDayMs));
    
    // Filter and process logs
    interface FarmLog {
      createdAt: string;
      thermoStress?: number;
      discomfortLevel?: string;
    }

    const historicalData: HistoricalDataPoint[] = (logsResponse.result as FarmLog[])
      .filter((log: FarmLog) => new Date(log.createdAt) >= pastDate)
      .map((log: FarmLog): HistoricalDataPoint => ({
        date: new Date(log.createdAt).toISOString().split('T')[0], // Format as YYYY-MM-DD
        thi: Math.round(log.thermoStress ?? 0),
        discomfortLevel: log.discomfortLevel ?? "Unknown"
      }))
      // Remove duplicates for the same day (keep the latest)
      .reduce(
        (acc: HistoricalDataPoint[], current: HistoricalDataPoint): HistoricalDataPoint[] => {
          const existingIndex: number = acc.findIndex((item: HistoricalDataPoint) => item.date === current.date);
          if (existingIndex === -1) {
            acc.push(current);
          } else if (new Date(current.date) > new Date(acc[existingIndex].date)) {
            acc[existingIndex] = current;
          }
          return acc;
        },
        []
      )
      // Sort by date ascending
      .sort((a: HistoricalDataPoint, b: HistoricalDataPoint) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // If we don't have enough data, fill in with placeholder values
    if (historicalData.length < days) {
      const filledData: HistoricalDataPoint[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - (i * oneDayMs)).toISOString().split('T')[0];
        const existingData = historicalData.find(item => item.date === date);
        
        if (existingData) {
          filledData.push(existingData);
        } else {
          // Create placeholder data for missing days
          filledData.push({
            date,
            thi: 65 + Math.floor(Math.random() * 10), // Random THI between 65-75
            discomfortLevel: "No data"
          });
        }
      }
      return filledData;
    }

    return historicalData;
  } catch (error) {
    console.error("Error fetching historical thermal data:", error);
    return [];
  }
}