"use client";

import { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { RouteInfo } from "@/app/passenger/page";

type DirectionsRendererProps = {
  originId: string;
  destinationId: string;
  onRouteInfo: (info: RouteInfo | null) => void;
};

export function DirectionsRenderer({
  originId,
  destinationId,
  onRouteInfo,
}: DirectionsRendererProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: { placeId: originId },
        destination: { placeId: destinationId },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        const route = response.routes[0];
        if (route && route.legs[0]) {
            const leg = route.legs[0];
            onRouteInfo({
                distance: leg.distance?.text || 'N/A',
                duration: leg.duration?.text || 'N/A',
            });
        }
      }).catch(() => onRouteInfo(null));

      return () => {
        // Clear route info when component unmounts or dependencies change
        onRouteInfo(null);
      }
  }, [directionsService, directionsRenderer, originId, destinationId, onRouteInfo]);

  return null;
}
