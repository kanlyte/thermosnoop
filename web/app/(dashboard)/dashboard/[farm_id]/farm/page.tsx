import { getFarmLogs, getFarmsPerUser } from "@/actions/farms";
import FarmDetailClient from "@/components/dashboard/FarmDetailClient";
import { auth } from "@/auth";

interface FarmDetailPageProps {
  params: Promise<{ farm_id: string }>;
}

const toTwoDecimal = (value: any) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(2) : "N/A";
};

export default async function FarmDetailPage({ params }: FarmDetailPageProps) {
  const { farm_id } = await params;
  const session = await auth();

  try {
    if (!session?.user || !session.accessToken) {
      throw new Error("User session not found. Please log in.");
    }

    const farmsResponse = await getFarmsPerUser(
      session.user.id,
      session.accessToken as string
    );

    if (!farmsResponse.success) {
      throw new Error(farmsResponse.error || "Failed to fetch farm data");
    }

    const foundFarm = farmsResponse.result.find(
      (f: any) => f.id.toString() === farm_id
    );

    if (!foundFarm) {
      throw new Error("Farm not found");
    }

    let logsData: any = null;

    try {
      const logsResponse = await getFarmLogs(farm_id);
      if (logsResponse.success && logsResponse.result.length > 0) {
        logsData = logsResponse.result[0];
      }
    } catch (err) {
      console.error(`Farm logs fetch failed for farm ${farm_id}`, err);
    }

    const farmData = {
      ...foundFarm,
      location: foundFarm.district,
      image: `https://picsum.photos/seed/${foundFarm.id}/600/400`,

      thermoStress: logsData?.thermoStress
        ? Number(logsData.thermoStress).toFixed(2)
        : "N/A",

      updatedAtLogs: logsData?.updatedAt,
      discomfortLevel: logsData?.discomfortLevel ?? "N/A",

      temp_value: toTwoDecimal(logsData?.temp_value),
      hum_value: toTwoDecimal(logsData?.hum_value),

      recommendation: logsData?.recommendation ?? "N/A",

      hourly_temp: toTwoDecimal(logsData?.hr_temp),
      hourly_hum: toTwoDecimal(logsData?.hr_hum),
      hr_thermoStress: toTwoDecimal(logsData?.hr_thermoStress),
      hr_discomfortLevel: logsData?.hr_discomfortLevel ?? "N/A",
      hr_recommendation: logsData?.hr_recommendation ?? "N/A",

      daily_temp: toTwoDecimal(logsData?.daily_temp),
      daily_hum: toTwoDecimal(logsData?.daily_hum),
      daily_thermoStress: toTwoDecimal(logsData?.daily_thermoStress),
      daily_discomfortLevel: logsData?.daily_discomfortLevel ?? "N/A",
      daily_recommendation: logsData?.daily_recommendation ?? "N/A",

      weekly_temp: toTwoDecimal(logsData?.weekly_temp),
      weekly_hum: toTwoDecimal(logsData?.weekly_hum),
      weekly_thermoStress: toTwoDecimal(logsData?.weekly_thermoStress),
      weekly_discomfortLevel: logsData?.weekly_discomfortLevel ?? "N/A",
      weekly_recommendation: logsData?.weekly_recommendation ?? "N/A",
    };

    return <FarmDetailClient session={session} initialFarm={farmData} />;
  } catch (error) {
    return (
      <FarmDetailClient
        session={session}
        initialFarm={null}
        error={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }
      />
    );
  }
}