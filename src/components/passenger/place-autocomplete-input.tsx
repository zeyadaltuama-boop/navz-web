'use client';

import { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from '../ui/input';
import { MapPin } from 'lucide-react';

type PlaceAutocompleteProps = {
  id: string;
  placeholder: string;
  value?: string;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export function PlaceAutocompleteInput({
  id,
  placeholder,
  value,
  onPlaceSelect,
}: PlaceAutocompleteProps) {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    autocomplete.current = new places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry'],
    });

    autocomplete.current.addListener('place_changed', () => {
      onPlaceSelect(autocomplete.current?.getPlace() ?? null);
    });
  }, [places, onPlaceSelect]);

  useEffect(() => {
    if (inputRef.current && value !== undefined) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        id={id}
        ref={inputRef}
        className="pl-9"
        placeholder={placeholder}
      />
    </div>
  );
}
