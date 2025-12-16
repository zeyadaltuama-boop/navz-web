'use client';

import { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import RideRequestPanel from '@/components/passenger/ride-request-panel';
import MapView from '@/components/passenger/map-view';

export type RouteInfo = {
  distance: string;
  duration: string;
}

export default function PassengerPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [pickupPlace, setPickupPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [dropoffPlace, setDropoffPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);


  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="rounded-lg border bg-card p-6 text-center shadow-lg">
                <h2 className="text-2xl font-bold">Google Maps API Key Missing</h2>
                <p className="mt-2 text-muted-foreground">
                    Please add your Google Maps API key to the <code>.env</code> file to see the map.
                </p>
                <pre className="mt-4 rounded-md bg-muted p-2 text-sm">
                    <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"</code>
                </pre>
            </div>
        </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative h-[calc(100vh-3.5rem)] w-full">
        <MapView 
            pickupPlace={pickupPlace} 
            dropoffPlace={dropoffPlace} 
            onRouteInfo={setRouteInfo}
        />
        <div className="absolute top-4 left-1/2 z-10 w-[95%] max-w-sm -translate-x-1/2 md:left-6 md:translate-x-0">
          <RideRequestPanel 
            onPickupSelect={setPickupPlace} 
            onDropoffSelect={setDropoffPlace}
            routeInfo={routeInfo}
         />
        </div>
      </div>
    </APIProvider>
  );
}
