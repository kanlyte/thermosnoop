"use client"

import { LoadScript } from '@react-google-maps/api'

const libraries: ("places" | "geocoding")[] = ["places", "geocoding"]

interface GoogleMapsLoaderProps {
  children: React.ReactNode
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAguSHAFGIi0sV9eXh1ukxzezwtP8iV0tc'}
      libraries={libraries}
      loadingElement={
        <div className="flex items-center justify-center p-4">
          <div>Loading Google Maps...</div>
        </div>
      }
      onError={() => console.error('Failed to load Google Maps API')}
    >
      {children}
    </LoadScript>
  )
}