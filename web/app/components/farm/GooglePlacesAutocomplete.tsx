"use client";

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Loader2, MapPin, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

const libraries: ("places" | "geocoding")[] = ["places", "geocoding"];

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (details: any) => void;
  placeholder?: string;
  types?: string[];
  componentRestrictions?: { country: string };
}

export function GooglePlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Search for location",
  types = ["(regions)"],
  componentRestrictions = { country: "ug" },
}: GooglePlacesAutocompleteProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "thermosnoop-google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    autocompleteService.current =
      new window.google.maps.places.AutocompleteService();

    const div = document.createElement("div");
    placesService.current = new window.google.maps.places.PlacesService(div);
  }, [isLoaded]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value ?? "";
    setValue(inputValue);

    if (inputValue.length <= 2 || !autocompleteService.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);

    autocompleteService.current.getPlacePredictions(
      {
        input: inputValue,
        types,
        componentRestrictions,
      },
      (predictions, status) => {
        setIsSearching(false);

        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  const handleSelect = (placeId: string, description: string) => {
    setValue(description ?? "");
    setShowSuggestions(false);
    setIsSearching(true);

    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId,
        fields: [
          "geometry",
          "formatted_address",
          "name",
          "address_components",
        ],
      },
      (place, status) => {
        setIsSearching(false);

        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          onPlaceSelect({
            geometry: place.geometry,
            formatted_address: place.formatted_address,
            name: place.name,
            address_components: place.address_components,
          });
        }
      }
    );
  };

  if (loadError) {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
        <Input
          value=""
          disabled
          placeholder="Failed to load Google Maps"
          className="h-12 rounded-xl border-red-200 pl-10"
        />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="relative">
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        <Input
          value=""
          disabled
          placeholder="Loading location search..."
          className="h-12 rounded-xl border-slate-200 pl-10"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

        <Input
          value={value ?? ""}
          onChange={handleInput}
          placeholder={isSearching ? "Searching..." : placeholder}
          className="h-12 rounded-xl border-slate-200 pl-10 focus-visible:ring-emerald-500"
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />

        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion.place_id}
              className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-emerald-50"
              onMouseDown={() =>
                handleSelect(suggestion.place_id, suggestion.description)
              }
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span className="text-slate-700">
                {suggestion.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}