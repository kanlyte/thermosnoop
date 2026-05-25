"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";


delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface ClientSideMapProps {
  region: {
    latitude: number;
    longitude: number;
  };
  onSelect: (lat: string, lng: string) => void;
}

const CENTRAL_LOCATION = {
  latitude: 0.33695153110668835,
  longitude: 32.57991314874516,
};

const createMarkerIcon = () => {
  return L.divIcon({
    className: "thermosnoop-marker",
    html: `
      <div style="
        background-color:#059669;
        width:26px;
        height:26px;
        border:4px solid white;
        border-radius:999px;
        box-shadow:0 4px 14px rgba(0,0,0,.25);
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

function LocationMarker({
  initialPosition,
  onSelect,
}: {
  initialPosition: [number, number];
  onSelect: (lat: string, lng: string) => void;
}) {
  const map = useMap();
  const hasInitialized = useRef(false);
  const [position, setPosition] = useState<[number, number]>(initialPosition);

  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;
    map.setView(initialPosition, 14);
  }, [map, initialPosition]);

  useMapEvents({
    click(e) {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];

      setPosition(newPosition);
      onSelect(newPosition[0].toString(), newPosition[1].toString());
    },
  });

  return (
    <Marker
      position={position}
      icon={createMarkerIcon()}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPosition = marker.getLatLng();

          setPosition([newPosition.lat, newPosition.lng]);
          onSelect(newPosition.lat.toString(), newPosition.lng.toString());
        },
      }}
    />
  );
}

function ZoomControls() {
  const map = useMap();

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar overflow-hidden rounded-lg">
        <button
          type="button"
          onClick={() => map.zoomIn()}
          title="Zoom in"
          className="block h-9 w-9 border-b bg-white text-lg font-bold hover:bg-slate-100"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => map.zoomOut()}
          title="Zoom out"
          className="block h-9 w-9 bg-white text-lg font-bold hover:bg-slate-100"
        >
          −
        </button>
      </div>
    </div>
  );
}

export default function ClientSideMap({
  region,
  onSelect,
}: ClientSideMapProps) {
  const initialPosition: [number, number] = useMemo(
    () => [
      Number(region?.latitude) || CENTRAL_LOCATION.latitude,
      Number(region?.longitude) || CENTRAL_LOCATION.longitude,
    ],
    [region?.latitude, region?.longitude]
  );

  return (
    <div className="h-full min-h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer
        center={initialPosition}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker initialPosition={initialPosition} onSelect={onSelect} />

        <ZoomControls />
      </MapContainer>
    </div>
  );
}