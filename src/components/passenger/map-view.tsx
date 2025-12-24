'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import {
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';

export type RouteInfo = {
  distance: string;
  duration: string;
};

type Props = {
  pickupPlace?: google.maps.places.PlaceResult | null;
  dropoffPlace?: google.maps.places.PlaceResult | null;
  locations?: google.maps.places.PlaceResult[];
  onRouteInfo?: (info: RouteInfo | null) => void;
};

type LatLngLiteral = { lat: number; lng: number };

function placeToLatLng(
  place?: google.maps.places.PlaceResult | null,
): LatLngLiteral | null {
  const loc = place?.geometry?.location;
  if (!loc) return null;
  return { lat: loc.lat(), lng: loc.lng() };
}

function LetterPin({ letter }: { letter: string }) {
  return (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-black shadow-md ring-1 ring-black/10">
      {letter}
    </div>
  );
}

function DirectionsAndMarkers({
  points,
  onRouteInfo,
}: {
  points: LatLngLiteral[];
  onRouteInfo?: (info: RouteInfo | null) => void;
}) {
  const map = useMap();
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!rendererRef.current) {
      rendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });
    }

    rendererRef.current.setMap(map as google.maps.Map);
    if (directions) rendererRef.current.setDirections(directions);

    return () => {
      rendererRef.current?.setMap(null);
    };
  }, [map, directions]);

  useEffect(() => {
    if (points.length < 2) {
      setDirections(null);
      onRouteInfo?.(null);
      return;
    }

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: points[0],
        destination: points[points.length - 1],
        waypoints:
          points.length > 2
            ? points.slice(1, -1).map((p) => ({
                location: p,
                stopover: true,
              }))
            : [],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status !== 'OK' || !result) return;

        setDirections(result);

        const legs = result.routes[0].legs;
        const meters = legs.reduce(
          (s, l) => s + (l.distance?.value ?? 0),
          0,
        );
        const seconds = legs.reduce(
          (s, l) => s + (l.duration?.value ?? 0),
          0,
        );

        onRouteInfo?.({
          distance: `${(meters / 1000).toFixed(1)} km`,
          duration: `${Math.round(seconds / 60)} mins`,
        });
      },
    );
  }, [points, onRouteInfo]);

  return (
    <>
      {points.map((p, i) => (
        <AdvancedMarker key={`${p.lat}-${p.lng}-${i}`} position={p}>
          <LetterPin letter={String.fromCharCode(65 + i)} />
        </AdvancedMarker>
      ))}
    </>
  );
}

export default function MapView({
  pickupPlace,
  dropoffPlace,
  locations,
  onRouteInfo,
}: Props) {
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

  const points = useMemo<LatLngLiteral[]>(() => {
    if (locations?.length) {
      return locations
        .map(placeToLatLng)
        .filter((p): p is LatLngLiteral => p !== null);
    }

    return [pickupPlace, dropoffPlace]
      .map(placeToLatLng)
      .filter((p): p is LatLngLiteral => p !== null);
  }, [locations, pickupPlace, dropoffPlace]);

  const defaultCenter =
    points[0] ?? { lat: 38.7223, lng: -9.1393 };

  return (
    <div className="h-full w-full">
      <Map
        mapId={mapId}               // ✅ THIS FIXES THE ERROR
        className="h-full w-full"
        defaultCenter={defaultCenter}
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI
      >
        <DirectionsAndMarkers points={points} onRouteInfo={onRouteInfo} />
      </Map>
    </div>
  );
}
