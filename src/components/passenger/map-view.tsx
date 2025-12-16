'use client';

import { useEffect, useState } from 'react';
import { Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { DirectionsRenderer } from './directions-renderer';

type MapViewProps = {
    pickupPlace: google.maps.places.PlaceResult | null;
    dropoffPlace: google.maps.places.PlaceResult | null;
}

export default function MapView({ pickupPlace, dropoffPlace }: MapViewProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !pickupPlace?.geometry?.location) return;
    
    if (!dropoffPlace?.geometry?.location) {
        map.setCenter(pickupPlace.geometry.location);
        map.setZoom(15);
    }
  }, [map, pickupPlace, dropoffPlace]);

  return (
    <>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 40.7128, lng: -74.0060 }} // Default to New York City
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="a2a2f7a8b1b2c3d4"
      >
        {pickupPlace?.geometry?.location && !dropoffPlace && (
            <AdvancedMarker position={pickupPlace.geometry.location} />
        )}
      </Map>
      {pickupPlace?.place_id && dropoffPlace?.place_id && (
          <DirectionsRenderer
              originId={pickupPlace.place_id}
              destinationId={dropoffPlace.place_id}
          />
      )}
    </>
  );
}
