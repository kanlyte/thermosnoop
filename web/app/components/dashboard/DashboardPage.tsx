"use client"

import { Thermometer, MapPin, Search, Plus, Sun, Gauge } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Session } from 'next-auth';
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchUserFarms, MyFarm } from "@/actions/shared"


export default function FarmsList({ session }: { session: Session }) {
  const [my_farms, setFarms] = useState<MyFarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFarms = async () => {
      if (!session?.user?.id) return;
      
      setLoading(true);
      setError(null);
      
      const { farms, error } = await fetchUserFarms(session);
      
      if (farms) {
        setFarms(farms);
      } else {
        setError(error);
        console.error(error);
      }
      
      setLoading(false);
    };

    loadFarms();
  }, [session]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading farms...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  console.log("My farms:", my_farms);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 md:p-8">
        {/* Welcome Section - Mobile responsive */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 mb-2">
                Good morning {session?.user?.name}, welcome to your farm watch dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Monitor thermal stress levels of your cattle to increase productive and reproductive efficiency
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Sun className="h-4 w-4" />
                Weather Alert
              </Button>
              <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Gauge className="h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Farms Section - Mobile responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">My Farms</h1>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search farms..."
                className="pl-9 w-full"
              />
            </div>

            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <Link href="/dashboard/add-farm">
                <span className="sr-only sm:not-sr-only">Add Farm</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Farms Grid - Responsive columns */}
        {my_farms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You don't have any farms yet.</p>
            <Button asChild>
              <Link href="/dashboard/add-farm">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Farm
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {my_farms.map((farm) => (
              <Card
                key={farm.id}
                className="hover:shadow-md transition-shadow overflow-hidden border-gray-200"
              >
                <div className="relative h-36 sm:h-40">
                  <img
                    src={farm.image}
                    alt={farm.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 px-2 py-1 text-xs sm:text-sm
                      ${farm.discomfortLevel === "No thermal Stress" ? "bg-green-500 text-white" :
                        farm.discomfortLevel === "Mild discomfort" ? "bg-yellow-400 text-black" :
                          farm.discomfortLevel === "Discomfort" ? "bg-orange-400 text-white" :
                            farm.discomfortLevel === "Alert" ? "bg-red-400 text-white" :
                              farm.discomfortLevel === "Danger" ? "bg-red-600 text-white" :
                                farm.discomfortLevel === "Emergency" ? "bg-purple-700 text-white" :
                                  "bg-gray-400 text-white"
                      }
                    `}
                  >
                    {farm.discomfortLevel}
                  </Badge>
                </div>

                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg">{farm.name}</CardTitle>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{farm.location}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                      <span className="text-sm sm:text-base font-medium">THI Value: {farm?.thermoStress}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button variant="outline" className="w-full text-sm sm:text-base" asChild>
                    <Link href={`/dashboard/${farm.id}/farm`}>
                      View Farm Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}