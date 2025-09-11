"use client"

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Create a draggable marker icon
const createDraggableIcon = () => {
  return L.divIcon({
    className: 'draggable-marker',
    html: `<div style="
      background-color: darkgreen;
      width: 24px;
      height: 24px;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

interface ClientSideMapProps {
  region: {
    latitude: number
    longitude: number
  }
  onSelect: (lat: string, lng: string) => void
}

// Central location fallback (Kampala)
const CENTRAL_LOCATION = {
  latitude: 0.33695153110668835,
  longitude: 32.57991314874516,
};

function LocationMarker({ onSelect, initialPosition }: { 
  onSelect: (lat: string, lng: string) => void 
  initialPosition: [number, number]
}) {
  const [position, setPosition] = useState(initialPosition)
  const map = useMap()
  
  // Set initial view
  useState(() => {
    map.setView(initialPosition, 14)
  })

  useMapEvents({
    click(e) {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng]
      setPosition(newPosition)
      onSelect(newPosition[0].toString(), newPosition[1].toString())
    },
    drag() {
      const center = map.getCenter()
      const newPosition: [number, number] = [center.lat, center.lng]
      setPosition(newPosition)
      onSelect(newPosition[0].toString(), newPosition[1].toString())
    },
  })

  return position ? (
    <Marker 
      position={position} 
      icon={createDraggableIcon()}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const position = marker.getLatLng()
          setPosition([position.lat, position.lng])
          onSelect(position.lat.toString(), position.lng.toString())
        },
      }}
    />
  ) : null
}

// Zoom control component
function ZoomControls() {
  const map = useMap()

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={() => map.zoomIn()}
          className="leaflet-control-zoom-in"
          title="Zoom in"
          style={{
            backgroundColor: 'white',
            border: 'none',
            borderBottom: '1px solid #ccc',
            fontSize: '18px',
            fontWeight: 'bold',
            width: '30px',
            height: '30px',
            lineHeight: '30px',
            cursor: 'pointer',
          }}
        >
          +
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="leaflet-control-zoom-out"
          title="Zoom out"
          style={{
            backgroundColor: 'white',
            border: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            width: '30px',
            height: '30px',
            lineHeight: '30px',
            cursor: 'pointer',
          }}
        >
          −
        </button>
      </div>
    </div>
  )
}

export default function ClientSideMap({ region, onSelect }: ClientSideMapProps) {
  const initialPosition: [number, number] = [
    region?.latitude || CENTRAL_LOCATION.latitude,
    region?.longitude || CENTRAL_LOCATION.longitude
  ]

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={initialPosition}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Disable default controls to use custom ones
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          onSelect={onSelect} 
          initialPosition={initialPosition}
        />
        <ZoomControls />
      </MapContainer>
    </div>
  )
}