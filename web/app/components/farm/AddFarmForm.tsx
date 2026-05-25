"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Plus,
  Search,
} from "lucide-react";

import { addFarm } from "@/actions/farms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LocationPickerModal } from "./LocationPickerModal";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";

interface FarmData {
  name: string;
  district: string;
  latitude: string;
  longtude: string;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

export default function AddFarmForm({ session }: { session: Session }) {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FarmData>({
    name: "",
    district: "",
    latitude: "",
    longtude: "",
  });

  const [region, setRegion] = useState<Coordinate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const handlePlaceSelect = (details: any) => {
    if (!details?.geometry?.location) return;

    const lat = details.geometry.location.lat();
    const lng = details.geometry.location.lng();

    setFormData((prev) => ({
      ...prev,
      district: details.formatted_address || "",
      latitude: lat.toString(),
      longtude: lng.toString(),
    }));

    setRegion({
      latitude: lat,
      longitude: lng,
    });
  };

  const handleLocationSelect = (lat: string, lng: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat ?? "",
      longtude: lng ?? "",
    }));
  };

  const showLocationPicker = () => {
    if (!region) {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please search for a location first.",
      });
      return;
    }

    setShowMapModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Farm Name Required",
        description: "Please enter the farm name.",
      });
      return;
    }

    if (!formData.district.trim()) {
      toast({
        variant: "destructive",
        title: "Farm Location Required",
        description: "Please search and select your farm location.",
      });
      return;
    }

    if (!formData.latitude || !formData.longtude) {
      toast({
        variant: "destructive",
        title: "Precise Location Required",
        description: "Please select the farm location on the map.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await addFarm(
        {
          ...formData,
          user_id: session.user.id as string,
          refreshToken: session.refreshToken as string,
        },
        session.accessToken as string
      );

      if (result.success) {
        toast({
          title: "Farm Added Successfully",
          description: `${formData.name} has been registered.`,
        });

        router.push("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Error Adding Farm",
          description: result.error || "An error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not connect to the server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-104px)]">
      <div className="mb-5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 px-0 text-slate-600 hover:bg-transparent hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Farms
        </Button>
      </div>

      <div className="grid min-h-[calc(100vh-160px)] grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                Farm Registration
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Add New Farm
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Register your farm by entering its name, selecting the general
                area, and confirming the exact location on the map.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Farm Name
                </Label>

                <Input
                  id="name"
                  name="name"
                  placeholder="Example: Green Valley Farm"
                  value={formData.name ?? ""}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-slate-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Farm Location</Label>

                <GooglePlacesAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Search farm district or area"
                />

                <p className="text-sm text-slate-500">
                  Search for the nearest district, town, village, or known area.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Precise Coordinates
                    </h3>
                    <p className="text-sm text-slate-500">
                      Confirm the exact position of the farm.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={showLocationPicker}
                    className="gap-2 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <MapPin className="h-4 w-4" />
                    Pick on Map
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Latitude</Label>
                    <Input
                      value={formData.latitude ?? ""}
                      readOnly
                      placeholder="Latitude"
                      className="h-12 rounded-xl border-slate-200 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Longitude</Label>
                    <Input
                      value={formData.longtude ?? ""}
                      readOnly
                      placeholder="Longitude"
                      className="h-12 rounded-xl border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {formData.district && (
                  <p className="mt-4 text-sm text-slate-500">
                    Selected area:{" "}
                    <span className="font-medium text-slate-700">
                      {formData.district}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-emerald-600 px-6 hover:bg-emerald-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Farm...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Farm
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-emerald-100 bg-white shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Search className="h-7 w-7" />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                How location works
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                First search for the farm area using Google Places. After that,
                open the map and move the marker to the exact farm position.
                The selected latitude and longitude will be saved with the farm.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-800">
                Tip
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-700">
                Pick the closest accurate point because temperature and humidity
                readings depend on this location.
              </p>
            </div>
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
  );
}