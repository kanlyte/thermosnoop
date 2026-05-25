"use client";

import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Clock,
  Droplets,
  History,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Thermometer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

import { getFarmLogs, getWeatherData, refreshFarmCurrentWeather } from "@/actions/farms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ThermalStressGraph from "../graphs/historical";

type MyFarm = {
  id: number;
  user_id: number;
  name: string;
  district: string;
  latitude: string;
  longtude: string;
  createdAt: string;
  updatedAt: string;
  updatedAtLogs?: string;
  location?: string;
  thermoStress?: string;
  discomfortLevel: string;
  temp_value: string;
  hum_value: string;
  recommendation: string;
  hr_thermoStress: string;
  hr_discomfortLevel: string;
  hourly_temp: string;
  hourly_hum: string;
  hr_recommendation: string;
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
  image?: string;
};

interface FarmDetailClientProps {
  session: Session | null;
  initialFarm: MyFarm | null;
  error?: string;
}

type MainTab = "current" | "forecast" | "history";
type ForecastTab = "hourly" | "daily" | "weekly";

const toTwoDecimal = (value: any) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(2) : "N/A";
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "N/A";

  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const updateFarmFromLog = (prev: MyFarm, log: any): MyFarm => {
  return {
    ...prev,

    thermoStress:
      log?.thermoStress !== undefined
        ? toTwoDecimal(log.thermoStress)
        : prev.thermoStress,

    updatedAtLogs: log?.updatedAt || new Date().toISOString(),

    discomfortLevel: log?.discomfortLevel ?? prev.discomfortLevel,

    temp_value:
      log?.temp_value !== undefined
        ? toTwoDecimal(log.temp_value)
        : prev.temp_value,

    hum_value:
      log?.hum_value !== undefined ? toTwoDecimal(log.hum_value) : prev.hum_value,

    recommendation: log?.recommendation ?? prev.recommendation,

    hourly_temp:
      log?.hr_temp !== undefined ? toTwoDecimal(log.hr_temp) : prev.hourly_temp,

    hourly_hum:
      log?.hr_hum !== undefined ? toTwoDecimal(log.hr_hum) : prev.hourly_hum,

    hr_thermoStress:
      log?.hr_thermoStress !== undefined
        ? toTwoDecimal(log.hr_thermoStress)
        : prev.hr_thermoStress,

    hr_discomfortLevel:
      log?.hr_discomfortLevel ?? prev.hr_discomfortLevel,

    hr_recommendation: log?.hr_recommendation ?? prev.hr_recommendation,

    daily_temp:
      log?.daily_temp !== undefined
        ? toTwoDecimal(log.daily_temp)
        : prev.daily_temp,

    daily_hum:
      log?.daily_hum !== undefined
        ? toTwoDecimal(log.daily_hum)
        : prev.daily_hum,

    daily_thermoStress:
      log?.daily_thermoStress !== undefined
        ? toTwoDecimal(log.daily_thermoStress)
        : prev.daily_thermoStress,

    daily_discomfortLevel:
      log?.daily_discomfortLevel ?? prev.daily_discomfortLevel,

    daily_recommendation:
      log?.daily_recommendation ?? prev.daily_recommendation,

    weekly_temp:
      log?.weekly_temp !== undefined
        ? toTwoDecimal(log.weekly_temp)
        : prev.weekly_temp,

    weekly_hum:
      log?.weekly_hum !== undefined
        ? toTwoDecimal(log.weekly_hum)
        : prev.weekly_hum,

    weekly_thermoStress:
      log?.weekly_thermoStress !== undefined
        ? toTwoDecimal(log.weekly_thermoStress)
        : prev.weekly_thermoStress,

    weekly_discomfortLevel:
      log?.weekly_discomfortLevel ?? prev.weekly_discomfortLevel,

    weekly_recommendation:
      log?.weekly_recommendation ?? prev.weekly_recommendation,
  };
};

export default function FarmDetailClient({
  session,
  initialFarm,
  error: initialError,
}: FarmDetailClientProps) {
  const [farm, setFarm] = useState<MyFarm | null>(initialFarm);
  const [loading, setLoading] = useState(!initialFarm && !initialError);
  const [error, setError] = useState<string | null>(initialError || null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>("current");
  const [forecastTab, setForecastTab] = useState<ForecastTab>("hourly");

  const [lastUpdated, setLastUpdated] = useState<string>(
    initialFarm?.updatedAtLogs
      ? formatDateTime(initialFarm.updatedAtLogs)
      : new Date().toLocaleString()
  );

  useEffect(() => {
    setLoading(false);
  }, [session]);

  const getStressBadge = (level?: string) => {
    if (!level) return "bg-slate-100 text-slate-700 border-slate-200";

    switch (level.toLowerCase()) {
      case "no thermal stress":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "mild discomfort":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "discomfort":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "alert":
      case "danger":
        return "bg-red-50 text-red-700 border-red-200";
      case "emergency":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

const handleRefreshWeather = async () => {
  if (!farm) return;

  try {
    setRefreshing(true);
    setError(null);

    const response = await refreshFarmCurrentWeather(
      parseFloat(farm.latitude),
      parseFloat(farm.longtude),
      farm.id.toString()
    );

    if (!response?.success) {
      setError(response?.error || "Failed to refresh current weather data.");
      return;
    }

    const latestLog = response.result;

    setFarm((prev) => {
      if (!prev) return prev;
      return updateFarmFromLog(prev, latestLog);
    });

    setLastUpdated(formatDateTime(latestLog.updatedAt || latestLog.createdAt));
  } catch (error) {
    console.error("Weather refresh error:", error);
    setError("Failed to refresh weather data. Please try again.");
  } finally {
    setRefreshing(false);
  }
};

  const MetricCard = ({
    title,
    value,
    suffix,
    icon,
  }: {
    title: string;
    value?: string;
    suffix?: string;
    icon: React.ReactNode;
  }) => (
    <Card className="border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="mt-3 flex items-end gap-1">
              <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                {value || "N/A"}
              </h3>
              {value && value !== "N/A" && suffix && (
                <span className="mb-1 text-sm font-semibold text-slate-500">
                  {suffix}
                </span>
              )}
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MainTabButton = ({
    value,
    title,
    icon,
  }: {
    value: MainTab;
    title: string;
    icon: React.ReactNode;
  }) => {
    const active = activeTab === value;

    return (
      <button
        type="button"
        onClick={() => setActiveTab(value)}
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
          active
            ? "bg-emerald-600 text-white shadow-sm"
            : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {icon}
        {title}
      </button>
    );
  };

  const ForecastButton = ({
    value,
    title,
  }: {
    value: ForecastTab;
    title: string;
  }) => {
    const active = forecastTab === value;

    return (
      <button
        type="button"
        onClick={() => setForecastTab(value)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          active
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-600 hover:bg-slate-100"
        }`}
      >
        {title}
      </button>
    );
  };

  const ForecastView = ({
    title,
    temp,
    hum,
    thi,
    level,
    recommendation,
  }: {
    title: string;
    temp: string;
    hum: string;
    thi: string;
    level: string;
    recommendation: string;
  }) => (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">
          Forecasted temperature, humidity and thermal stress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Temperature"
          value={temp}
          suffix="°C"
          icon={<Thermometer className="h-5 w-5" />}
        />
        <MetricCard
          title="Humidity"
          value={hum}
          suffix="%"
          icon={<Droplets className="h-5 w-5" />}
        />
        <MetricCard
          title="THI"
          value={thi}
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">
              Stress Level:
            </span>
            <Badge className={`${getStressBadge(level)} border`}>
              {level || "N/A"}
            </Badge>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            {recommendation || "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-14 rounded-2xl" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32 rounded-2xl" />
          ))}
        </div>

        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="max-w-md border border-red-200 bg-white text-center shadow-sm">
          <CardContent className="p-8">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="text-xl font-bold text-slate-900">
              Error Loading Farm
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <Button asChild className="mt-5 bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard">Back to Farms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!farm) return null;

  const farmImage =
    farm.image ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="px-0 text-slate-600">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to farms
        </Link>
      </Button>

      <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="relative h-64">
          <Image
            src={farmImage}
            alt={farm.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="mb-3 bg-white/90 text-emerald-700 hover:bg-white">
                Farm #{farm.id}
              </Badge>

              <h1 className="text-3xl font-bold text-white md:text-4xl">
                {farm.name}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                <MapPin className="h-4 w-4" />
                {farm.location || farm.district}
              </div>
            </div>

            <div className="rounded-2xl bg-white/95 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Last Updated
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {lastUpdated}
              </p>

              <Button
                onClick={handleRefreshWeather}
                disabled={refreshing}
                className="mt-3 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                {refreshing ? "Updating..." : "Get Current"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="border border-red-200 bg-red-50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <MainTabButton
          value="current"
          title="Current"
          icon={<Thermometer className="h-4 w-4" />}
        />
        <MainTabButton
          value="forecast"
          title="Forecast"
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <MainTabButton
          value="history"
          title="Past"
          icon={<History className="h-4 w-4" />}
        />
      </div>

      {activeTab === "current" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <MetricCard
              title="THI Value"
              value={farm.thermoStress}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <MetricCard
              title="Temperature"
              value={farm.temp_value}
              suffix="°C"
              icon={<Thermometer className="h-5 w-5" />}
            />
            <MetricCard
              title="Humidity"
              value={farm.hum_value}
              suffix="%"
              icon={<Droplets className="h-5 w-5" />}
            />

            <Card className="border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Stress Level
                    </p>
                    <Badge
                      className={`mt-4 border px-3 py-1 ${getStressBadge(
                        farm.discomfortLevel
                      )}`}
                    >
                      {farm.discomfortLevel || "N/A"}
                    </Badge>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-emerald-600" />
                Recommendation
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 text-sm leading-7 text-slate-700">
                {farm.recommendation || "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "forecast" && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-5">
            <div className="flex flex-wrap gap-2">
              <ForecastButton value="hourly" title="Next Hour" />
              <ForecastButton value="daily" title="Tomorrow" />
              <ForecastButton value="weekly" title="Next Week" />
            </div>

            {forecastTab === "hourly" && (
              <ForecastView
                title="Next Hour Forecast"
                temp={farm.hourly_temp}
                hum={farm.hourly_hum}
                thi={farm.hr_thermoStress}
                level={farm.hr_discomfortLevel}
                recommendation={farm.hr_recommendation}
              />
            )}

            {forecastTab === "daily" && (
              <ForecastView
                title="Tomorrow Forecast"
                temp={farm.daily_temp}
                hum={farm.daily_hum}
                thi={farm.daily_thermoStress}
                level={farm.daily_discomfortLevel}
                recommendation={farm.daily_recommendation}
              />
            )}

            {forecastTab === "weekly" && (
              <ForecastView
                title="Next Week Forecast"
                temp={farm.weekly_temp}
                hum={farm.weekly_hum}
                thi={farm.weekly_thermoStress}
                level={farm.weekly_discomfortLevel}
                recommendation={farm.weekly_recommendation}
              />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "history" && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Historical Thermal Stress
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ThermalStressGraph farmId={farm.id.toString()} days={7} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}