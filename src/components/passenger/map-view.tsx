'use client';

import { Map } from '@vis.gl/react-google-maps';

export default function MapView() {
  return (
    <Map
      style={{ width: '100%', height: '100%' }}
      defaultCenter={{ lat: 40.7128, lng: -74.0060 }} // Default to New York City
      defaultZoom={13}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      mapId="a2a2f7a8b1b2c3d4" // Optional: for custom map styling
    />
  );
}
