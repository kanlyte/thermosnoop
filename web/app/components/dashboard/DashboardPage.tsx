"use client"

import { Thermometer, MapPin, Search, Plus, Sun, Gauge } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Session } from 'next-auth';

// Mock data with farm images and thermostress
const farms = [
  {
    id: 1,
    name: "Green Valley Farm",
    location: "Nakuru, Kenya",
    temperature: 28,
    thermostress: "Moderate",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Sunrise Orchards",
    location: "Kiambu, Kenya",
    temperature: 26,
    thermostress: "Low",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Mountain View Plantation",
    location: "Kericho, Kenya",
    temperature: 22,
    thermostress: "None",
    image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Riverbend Gardens",
    location: "Kisumu, Kenya",
    temperature: 30,
    thermostress: "High",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  }
]

export default function FarmsList({ session }: { session: Session }) {
    console.log("Session in FarmsList:", session);
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
              <span className="sr-only sm:not-sr-only">Add Farm</span>
            </Button>
          </div>
        </div>

        {/* Farms Grid - Responsive columns */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {farms.map((farm) => (
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
                  variant={
                    farm.thermostress === "High" ? "destructive" :
                    farm.thermostress === "Moderate" ? "secondary" :
                    "default"
                  }
                  className="absolute top-2 right-2 px-2 py-1 text-xs sm:text-sm"
                >
                  {farm.thermostress} Thermostress
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
                    <span className="text-sm sm:text-base font-medium">{farm.temperature}°C</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full text-sm sm:text-base">
                  View Farm Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}