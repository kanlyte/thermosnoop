"use client"
import { useEffect, useRef, useState } from 'react'
import { MapPin, X, Plus, Minus, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

declare global {
  interface Window {
    google: any;
  }
}

const CENTRAL_LOCATION = {
  lat: 0.33695153110668835,
  lng: 32.57991314874516
}

interface LocationPickerModalProps {
  dismissSheet: () => void
  farm: any
  setFarm: (farm: any) => void
  region?: {
    latitude?: number
    longitude?: number
    latitudeDelta?: number
    longitudeDelta?: number
  }
}

export function LocationPickerModal({ dismissSheet, farm, setFarm, region }: LocationPickerModalProps) {
  const [loading, setLoading] = useState(true)
  const [currentLocation, setCurrentLocation] = useState({
    lat: region?.latitude || CENTRAL_LOCATION.lat,
    lng: region?.longitude || CENTRAL_LOCATION.lng
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [zoom, setZoom] = useState(14)
  
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  
  const MAX_ZOOM_LEVEL = 20
  const MIN_ZOOM_LEVEL = 3

  // Initialize Google Maps API
  useEffect(() => {
    const initGoogleMaps = () => {
      if (typeof window === 'undefined' || !window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
        script.async = true
        script.onload = () => {
          initializeServices()
          setLoading(false)
        }
        script.onerror = () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load Google Maps",
          })
          setLoading(false)
        }
        document.head.appendChild(script)
      } else {
        initializeServices()
        setLoading(false)
      }
    }

    const initializeServices = () => {
      if (typeof window !== 'undefined' && window.google && mapContainerRef.current) {
        geocoderRef.current = new google.maps.Geocoder()
        initializeMap()
      }
    }

    initGoogleMaps()

    return () => {
      if (mapRef.current) {
        google.maps.event.clearInstanceListeners(mapRef.current)
      }
      if (markerRef.current) {
        google.maps.event.clearInstanceListeners(markerRef.current)
      }
    }
  }, [])

  const initializeMap = () => {
    if (!mapContainerRef.current) return

    const initialLatLng = new google.maps.LatLng(
      currentLocation.lat,
      currentLocation.lng
    )

    mapRef.current = new google.maps.Map(mapContainerRef.current, {
      center: initialLatLng,
      zoom: zoom,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      backgroundColor: '#f0f0f0'
    })

    markerRef.current = new google.maps.Marker({
      position: initialLatLng,
      map: mapRef.current,
      draggable: true,
      title: "Selected Location"
    })

    // Event listeners
    google.maps.event.addListener(markerRef.current, 'dragend', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        setCurrentLocation({
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        })
      }
    })

    google.maps.event.addListener(mapRef.current, 'click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng && markerRef.current) {
        markerRef.current.setPosition(e.latLng)
        setCurrentLocation({
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        })
      }
    })
  }

  const handleSearch = () => {
    if (!searchQuery.trim() || !geocoderRef.current) return

    geocoderRef.current.geocode(
      { address: `${searchQuery}, Uganda` },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results?.[0] && mapRef.current && markerRef.current) {
          const location = results[0].geometry.location
          const newLatLng = new google.maps.LatLng(location.lat(), location.lng())
          
          mapRef.current.setCenter(newLatLng)
          markerRef.current.setPosition(newLatLng)
          setCurrentLocation({
            lat: location.lat(),
            lng: location.lng()
          })
          setZoom(14)
        } else {
          toast({
            variant: "destructive",
            title: "Location Not Found",
            description: `Could not find "${searchQuery}" in Uganda`,
          })
        }
      }
    )
  }

  const handleZoom = (isZoomIn: boolean) => {
    if (!mapRef.current) return

    let newZoom = isZoomIn ? zoom + 1 : zoom - 1
    newZoom = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, newZoom))
    
    if (newZoom !== zoom) {
      setZoom(newZoom)
      mapRef.current.setZoom(newZoom)
    }
  }

  const submitLocation = () => {
    setFarm({
      ...farm,
      latitude: currentLocation.lat,
      longtude: currentLocation.lng
    })
    dismissSheet()
  }

  return (
    <Dialog open onOpenChange={dismissSheet}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span>Pick Your Farm's Location</span>
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={dismissSheet}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search district (e.g. Pallisa)"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>

          <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p>Loading map...</p>
              </div>
            ) : (
              <>
                <div 
                  ref={mapContainerRef}
                  id="map"
                  className="h-full w-full"
                  style={{ height: '100%', width: '100%' }}
                />
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleZoom(true)}
                    disabled={zoom === MAX_ZOOM_LEVEL}
                    className={zoom === MAX_ZOOM_LEVEL ? "opacity-50" : ""}
                  >
                    <Plus className="h-4 w-4 text-green-800" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleZoom(false)}
                    disabled={zoom === MIN_ZOOM_LEVEL}
                    className={zoom === MIN_ZOOM_LEVEL ? "opacity-50" : ""}
                  >
                    <Minus className="h-4 w-4 text-green-800" />
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitude</Label>
              <Input value={currentLocation.lat.toFixed(6)} readOnly />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input value={currentLocation.lng.toFixed(6)} readOnly />
            </div>
          </div>

          <Button 
            className="w-full bg-green-800 hover:bg-green-900" 
            onClick={submitLocation}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}