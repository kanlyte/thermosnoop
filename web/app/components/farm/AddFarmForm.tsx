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

export default function AddFarmForm({ session }: { session: Session }) {
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    latitude: '',
    longitude: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/farm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: session?.user?.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Farm Added Successfully",
          description: `Your farm ${formData.name} has been registered.`,
        })
        router.push('/farms')
      } else {
        toast({
          variant: "destructive",
          title: "Error Adding Farm",
          description: data.data || "An error occurred",
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
      longitude: lng
    }))
    setShowMapModal(false)
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
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  name="district"
                  placeholder="Enter district (e.g., Kampala)"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Farm Location</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Latitude"
                    value={formData.latitude}
                    readOnly
                    className="flex-1"
                  />
                  <Input
                    placeholder="Longitude"
                    value={formData.longitude}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowMapModal(true)}
                  >
                    <MapPin className="h-4 w-4" />
                    Pick on Map
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.district ? `Map will show ${formData.district} area` : 'Enter district first'}
                </p>
              </div>

              <CardFooter className="p-0 pt-4 justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Farm'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>

      {showMapModal && (
        <LocationPickerModal
          district={formData.district}
          onSelect={handleLocationSelect}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </div>
  )
}