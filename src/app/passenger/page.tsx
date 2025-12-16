'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import RideRequestPanel from '@/components/passenger/ride-request-panel';
import MapView from '@/components/passenger/map-view';

export default function PassengerPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
        <MapView />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 z-10 p-4 md:p-6">
          <RideRequestPanel />
        </div>
      </div>
    </APIProvider>
  );
}
