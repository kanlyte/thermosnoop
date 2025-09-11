"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, ChevronLeft } from "lucide-react"
import { Session } from 'next-auth'
import { useToast } from '@/components/ui/use-toast'
import { LocationPickerModal } from './LocationPickerModal'
import { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete'
import { addFarm } from '@/actions/farms'

interface FarmData {
  name: string
  district: string
  latitude: string
  longtude: string  // Note the spelling matches your API
}

interface Coordinate {
  latitude: number
  longitude: number
}

export default function AddFarmForm({ session }: { session: Session }) {
  const [formData, setFormData] = useState<FarmData>({
    name: '',
    district: '',
    latitude: '',
    longtude: ''  // Changed from longitude to longtude
  })
  const [region, setRegion] = useState<Coordinate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceSelect = (details: any) => {
    if (details && details.geometry?.location) {
      const lat = details.geometry.location.lat()
      const lng = details.geometry.location.lng()
      
      setFormData(prev => ({
        ...prev,
        district: details.formatted_address || '',
        latitude: '',
        longtude: ''  // Changed from longitude to longtude
      }))
      
      setRegion({
        latitude: lat,
        longitude: lng
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.latitude || !formData.longtude) {  // Changed from longitude to longtude
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please select a location on the map",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await addFarm(
        {
          ...formData,
          user_id: session?.user?.id as string,
          refreshToken: session.refreshToken as string
        },
        session.accessToken as string,

      )

      if (result.success) {
        toast({
          title: "Farm Added Successfully",
          description: `Your farm ${formData.name} has been registered.`,
        })
        router.push('/dashboard')
      } else {
        toast({
          variant: "destructive",
          title: "Error Adding Farm",
          description: result.error || "An error occurred",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not connect to the server",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (lat: string, lng: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longtude: lng  // Changed from longitude to longtude
    }))
    setShowMapModal(false)
  }

  const showLocationPicker = () => {
    if (!formData.district) {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please search for a location first",
      })
      return
    }
    setShowMapModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 gap-2" 
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Farms
        </Button>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Add New Farm</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Farm Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter farm name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Farm Location</Label>
                <GooglePlacesAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Search for location"
                />
                <p className="text-sm text-muted-foreground">
                  Search for your farm's district or general area
                </p>
              </div>

              {region && (
                <div className="space-y-2">
                  <Label>Precise Location</Label>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Input
                      placeholder="Latitude"
                      value={formData.latitude}
                      readOnly
                      className="flex-1"
                    />
                    <Input
                      placeholder="Longitude"
                      value={formData.longtude}  // Changed from longitude to longtude
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={showLocationPicker}
                    >
                      <MapPin className="h-4 w-4" />
                      Pick on Map
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formData.district ? `Map will show ${formData.district} area` : 'Search for a location first'}
                  </p>
                </div>
              )}

              <CardFooter className="p-0 pt-4 justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.latitude}
                >
                  {isLoading ? 'Adding...' : 'Add Farm'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>

      {showMapModal && region && (
        <LocationPickerModal
          region={region}
          onSelect={handleLocationSelect}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </div>
  )
}