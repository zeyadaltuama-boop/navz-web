'use client';

import { useEffect, useMemo, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import MapView from '@/components/passenger/map-view';
import RideRequestPanel from '@/components/passenger/ride-request-panel';
import DriverProfileCard from '@/components/passenger/driver-profile-card';
import { auth, db } from '@/lib/firebase/client';

export type RouteInfo = {
  distance: string;
  duration: string;
};

type RideDoc = {
  id: string;
  status:
    | 'pending'
    | 'accepted'
    | 'arrived'
    | 'started'
    | 'completed'
    | 'cancelled';
};

type Stop = {
  id: string;
  place: google.maps.places.PlaceResult | null;
};

export default function PassengerPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  const [uid, setUid] = useState('');
  const [pickupPlace, setPickupPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [dropoffPlace, setDropoffPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [activeRide, setActiveRide] = useState<RideDoc | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        const cred = await signInAnonymously(auth);
        setUid(cred.user.uid);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const qy = query(
      collection(db, 'rides'),
      where('passengerId', '==', uid),
      where('status', 'in', ['pending', 'accepted', 'arrived', 'started']),
      orderBy('createdAt', 'desc'),
      limit(1),
    );

    const unsub = onSnapshot(qy, (snap) => {
      if (snap.empty) {
        setActiveRide(null);
        return;
      }
      const d = snap.docs[0];
      setActiveRide({ id: d.id, ...(d.data() as any) });
    });

    return () => unsub();
  }, [uid]);

  const locations = useMemo(
    () =>
      [pickupPlace, ...stops.map((s) => s.place), dropoffPlace].filter(
        Boolean,
      ) as google.maps.places.PlaceResult[],
    [pickupPlace, stops, dropoffPlace],
  );

  if (!apiKey) return null;

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative h-screen w-full">
        {/* MAP */}
        <MapView
          locations={locations}
          pickupPlace={pickupPlace}
          dropoffPlace={dropoffPlace}
          onRouteInfo={setRouteInfo}
        />

        {/* PANEL */}
        <div className="absolute top-4 left-1/2 z-10 w-[95%] max-w-sm -translate-x-1/2 md:left-6 md:translate-x-0">
          {activeRide && activeRide.status !== 'pending' ? (
            <DriverProfileCard passengerId={uid} rideId={activeRide.id} />
          ) : (
            <RideRequestPanel
              passengerId={uid}
              pickupPlace={pickupPlace}
              dropoffPlace={dropoffPlace}
              stops={stops}
              onStopsChange={setStops}
              onPickupSelect={setPickupPlace}
              onDropoffSelect={setDropoffPlace}
              routeInfo={routeInfo}
              onRideCreated={() => {}}
            />
          )}
        </div>
      </div>
    </APIProvider>
  );
}
