"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { useLoadScript } from '@react-google-maps/api'

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (details: any) => void
  placeholder?: string
  types?: string[]
  componentRestrictions?: { country: string }
}

export function GooglePlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Search for location",
  types = ['(regions)'],
  componentRestrictions = { country: 'ug' }
}: GooglePlacesAutocompleteProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geocoding'],
  })

  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService()
      const div = document.createElement('div')
      placesService.current = new google.maps.places.PlacesService(div)
    }
  }, [isLoaded])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
    
    if (inputValue.length > 2 && autocompleteService.current) {
      setIsLoading(true)
      autocompleteService.current.getPlacePredictions({
        input: inputValue,
        types: types,
        componentRestrictions: componentRestrictions
      }, (predictions, status) => {
        setIsLoading(false)
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      })
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelect = (placeId: string, description: string) => {
    setValue(description)
    setShowSuggestions(false)
    setIsLoading(true)

    if (placesService.current) {
      placesService.current.getDetails({
        placeId: placeId,
        fields: ['geometry', 'formatted_address', 'name', 'address_components']
      }, (place, status) => {
        setIsLoading(false)
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          onPlaceSelect({
            geometry: place.geometry,
            formatted_address: place.formatted_address,
            name: place.name,
            address_components: place.address_components
          })
        }
      })
    }
  }

  if (!isLoaded) {
    return (
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            disabled
            placeholder="Loading Google Maps..."
            className="pl-10"
          />
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            disabled
            placeholder="Error loading maps. Check console."
            className="pl-10"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={value}
          onChange={handleInput}
          placeholder={isLoading ? "Searching..." : placeholder}
          className="pl-10"
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
              onMouseDown={() => handleSelect(suggestion.place_id, suggestion.description)}
            >
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm">{suggestion.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}