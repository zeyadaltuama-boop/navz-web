"use client";

import { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

type DirectionsRendererProps = {
  originId: string;
  destinationId: string;
};

export function DirectionsRenderer({
  originId,
  destinationId,
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
      });
  }, [directionsService, directionsRenderer, originId, destinationId]);

  return null;
}
