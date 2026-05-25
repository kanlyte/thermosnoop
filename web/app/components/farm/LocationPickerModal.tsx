"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DynamicMap = dynamic(() => import("./ClientSideMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-2xl bg-slate-100">
      <div className="text-sm text-slate-500">Loading map...</div>
    </div>
  ),
});

interface LocationPickerModalProps {
  region: {
    latitude: number;
    longitude: number;
  };
  onSelect: (lat: string, lng: string) => void;
  onClose: () => void;
}

export function LocationPickerModal({
  region,
  onSelect,
  onClose,
}: LocationPickerModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="h-[90vh] max-w-6xl p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <MapPin className="h-5 w-5 text-emerald-600" />
            Pick Your Farm Location
          </DialogTitle>
        </DialogHeader>

        <div className="h-[calc(90vh-145px)] px-6 py-4">
          <DynamicMap region={region} onSelect={onSelect} />
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Submit Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}