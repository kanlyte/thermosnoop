"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

// Dynamically import the map component with SSR disabled
const DynamicMap = dynamic(() => import('./ClientSideMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="animate-pulse text-gray-500">Loading map...</div>
    </div>
  )
})

interface LocationPickerModalProps {
  region: {
    latitude: number
    longitude: number
  }
  onSelect: (lat: string, lng: string) => void
  onClose: () => void
}

export function LocationPickerModal({ region, onSelect, onClose }: LocationPickerModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] sm:h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-gray-600 text-lg font-bold text-center">
            Pick Your Farm's Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="h-full w-full flex-1 min-h-[400px]">
          <DynamicMap region={region} onSelect={onSelect} />
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onClose}
            className="bg-darkgreen hover:bg-darkgreen/90"
          >
            Submit Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}