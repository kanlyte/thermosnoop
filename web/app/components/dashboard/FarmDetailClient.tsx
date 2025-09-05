"use client"

import { Thermometer, MapPin, Droplets, Calendar, AlertTriangle, Clock, ChevronLeft, BarChart3, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Session } from 'next-auth'
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getWeatherData } from "@/actions/farms"
import ThermalStressGraph from "../graphs/historical"

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
  thermoStress?: number;
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
  session: Session;
  initialFarm: MyFarm | null;
  error?: string;
}

export default function FarmDetailClient({ 
  session, 
  initialFarm,
  error: initialError 
}: FarmDetailClientProps) {
  const [farm, setFarm] = useState<MyFarm | null>(initialFarm)
  const [loading, setLoading] = useState(!initialFarm && !initialError)
  const [error, setError] = useState<string | null>(initialError || null)
  const [activeTab, setActiveTab] = useState("current")
  const [refreshing, setRefreshing] = useState(false)
  console.log("FarmDetailClient:", initialFarm,)
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString())
  // If you need to refetch data periodically, you can keep useEffect
  useEffect(() => {
    // Optional: Add real-time data fetching here if needed
  }, [session])

  const getDiscomfortColor = (level: string) => {
    if (!level) return "bg-gray-400 text-white"
    
    switch(level.toLowerCase()) {
      case "no thermal stress":
        return "bg-green-500 text-white"
      case "mild discomfort":
        return "bg-yellow-400 text-black"
      case "discomfort":
        return "bg-orange-500 text-white"
      case "alert":
        return "bg-red-500 text-white"
      case "danger":
        return "bg-red-600 text-white"
      case "emergency":
        return "bg-purple-700 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  // Mock historical data for the chart
  const historicalData = [
    { date: "Aug 25", thi: 68 },
    { date: "Aug 26", thi: 70 },
    { date: "Aug 27", thi: 72 },
    { date: "Aug 28", thi: 71 },
    { date: "Aug 29", thi: 73 },
    { date: "Aug 30", thi: 72 },
  ]
const handleRefreshWeather = async () => {
  if (!farm) return;
  try {
    setRefreshing(true);
    setError(null);
    const weatherResponse = await getWeatherData(
      parseFloat(farm.latitude),
      parseFloat(farm.longtude),
      farm.id.toString()
    );
    if (weatherResponse && weatherResponse.success) {
      console.log("Weather data refreshed successfully");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date().toLocaleString());
      
    } else if (weatherResponse && weatherResponse.error) {
      setError(weatherResponse.error);
    } else {
      setError("Unexpected response from weather service");
    }
  } catch (error) {
    console.error("Weather refresh error:", error);
    setError("Failed to refresh weather data. Please try again.");
  } finally {
    setRefreshing(false);
  }
};
console.log("UpdatedAtLogs:", farm?.updatedAtLogs);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Farm Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link href="/dashboard">Back to Farms</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Farm Not Found</h2>
          <p className="text-muted-foreground mb-4">The farm you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/dashboard">Back to Farms</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Header with back button */}
      <div className="mb-6">
        <Button variant="ghost" className="pl-0 mb-4" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Farms
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{farm.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{farm.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Last updated: {farm.updatedAtLogs ? new Date(farm.updatedAtLogs).toLocaleDateString() : "N/A"} {farm.updatedAtLogs ? new Date(farm.updatedAtLogs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
            </span>
            <Button 
              onClick={handleRefreshWeather}
              disabled={refreshing}
              className="gap-2"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Get Current
            </Button>
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Current
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Past
          </TabsTrigger>
        </TabsList>

        {/* Current Tab */}
        <TabsContent value="current" className="space-y-6">
          {/* Key metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">THI Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">{farm.thermoStress || "N/A"}</div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Air Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-800 flex items-center gap-1">
                  <Thermometer className="h-5 w-5" />
                  {farm.temp_value || "N/A"}°C
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cyan-50 border-cyan-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cyan-700">Relative Humidity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-800 flex items-center gap-1">
                  <Droplets className="h-5 w-5" />
                  {farm.hum_value || "N/A"}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Thermal Stress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold px-3 py-1 rounded-full inline-block ${getDiscomfortColor(farm.discomfortLevel)}`}>
                  {farm.discomfortLevel}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendation section */}
          <Card className="bg-amber-50 border-amber-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700">{farm.recommendation}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-6">
          <Tabs defaultValue="nextHour" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="nextHour" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Next Hour
              </TabsTrigger>
              <TabsTrigger value="tomorrow" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tomorrow
              </TabsTrigger>
              <TabsTrigger value="nextWeek" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Next Week
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nextHour">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      {farm.hourly_temp}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      {farm.hourly_hum}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">THI Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{farm.hr_thermoStress}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Expected Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Thermal Stress Level: </span>
                      <Badge className={`ml-2 ${getDiscomfortColor(farm.hr_discomfortLevel)}`}>
                        {farm.hr_discomfortLevel}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Recommendation: </span>
                      <p className="text-muted-foreground mt-1">{farm.hr_recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tomorrow">
              {/* Similar structure for tomorrow's forecast */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      {farm.daily_temp}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      {farm.daily_hum}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">THI Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{farm.daily_thermoStress}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Expected Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Thermal Stress Level: </span>
                      <Badge className={`ml-2 ${getDiscomfortColor(farm.daily_discomfortLevel)}`}>
                        {farm.daily_discomfortLevel}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Recommendation: </span>
                      <p className="text-muted-foreground mt-1">{farm.daily_recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nextWeek">
              {/* Similar structure for next week's forecast */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      {farm.weekly_temp}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      {farm.weekly_hum}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">THI Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{farm.weekly_thermoStress}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Expected Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Thermal Stress Level: </span>
                      <Badge className={`ml-2 ${getDiscomfortColor(farm.weekly_discomfortLevel)}`}>
                        {farm.weekly_discomfortLevel}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Recommendation: </span>
                      <p className="text-muted-foreground mt-1">{farm.weekly_recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Past Tab */}
        <TabsContent value="past">
  <ThermalStressGraph
    farmId={farm.id.toString()} // Pass the actual farm ID as string
    days={7} // Optional: default is 7 days
  />
</TabsContent>
        {/* <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Historical Thermal Stress Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg p-4 flex items-end justify-between">
                {historicalData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-blue-500 w-8 rounded-t-md" 
                      style={{ height: `${(data.thi - 65) * 5}px` }}
                    ></div>
                    <span className="text-xs mt-2">{data.date}</span>
                    <span className="text-xs font-semibold">{data.thi}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average THI</p>
                  <p className="text-xl font-bold">71</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Peak THI</p>
                  <p className="text-xl font-bold">73</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}