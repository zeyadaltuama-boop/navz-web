'use client';

import React, { useEffect } from 'react';
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  User,
  Users,
  Package,
  ArrowUpDown,
  Plus,
  X,
  Clock,
  Milestone,
  Wallet,
  Sparkles, // 🔵 NAVZ AI
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlaceAutocompleteInput } from '@/components/passenger/place-autocomplete-input';
import type { RouteInfo } from '@/app/passenger/page';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase/client';

async function resolvePlace(
  text: string
): Promise<google.maps.places.PlaceResult | null> {
  return new Promise((resolve) => {
    if (!window.google?.maps?.places) return resolve(null);

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.textSearch({ query: text }, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results?.[0]
      ) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
}

type ServiceType = 'ride' | 'ride_for_others' | 'item_pickup';

type Stop = {
  id: string;
  place: google.maps.places.PlaceResult | null;
};

type Props = {
  passengerId: string;
  pickupPlace: google.maps.places.PlaceResult | null;
  dropoffPlace: google.maps.places.PlaceResult | null;
  stops?: Stop[];
  onStopsChange?: (stops: Stop[]) => void;
  onPickupSelect: (p: google.maps.places.PlaceResult | null) => void;
  onDropoffSelect: (p: google.maps.places.PlaceResult | null) => void;
  routeInfo: RouteInfo | null;
  onRideCreated?: (rideId: string) => void;
};
function isoToDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function RideRequestPanel({
  passengerId,
  pickupPlace,
  dropoffPlace,
  stops,
  onStopsChange,
  onPickupSelect,
  onDropoffSelect,
  routeInfo,
  onRideCreated,
}: Props) {
  const [serviceType, setServiceType] = React.useState<ServiceType>('ride');
  const [extraStops, setExtraStops] = React.useState<Stop[]>([]);
  const [scheduleAt, setScheduleAt] = React.useState('');
  const [desiredRate, setDesiredRate] = React.useState('');
  const [otherName, setOtherName] = React.useState('');
  const [itemDesc, setItemDesc] = React.useState('');
  const [itemNotes, setItemNotes] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  // 🔵 NAVZ AI
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiLoading, setAiLoading] = React.useState(false);

  const destinationWrap =
    'rounded-md bg-[#d9f7e7] border border-emerald-200 px-3 py-2';

  function placeDisplay(p: google.maps.places.PlaceResult | null) {
    return p?.name || p?.formatted_address || '';
  }

  function allStops() {
    return [pickupPlace, ...extraStops.map(s => s.place), dropoffPlace];
  }

  function addStop() {
    if (extraStops.length >= 3) return;
    setExtraStops(p => [...p, { id: crypto.randomUUID(), place: null }]);
  }

  function removeStop(id: string) {
    setExtraStops(p => p.filter(s => s.id !== id));
  }

  function swapAt(listIndex: number) {
    const list = allStops();
    if (!list[listIndex] || !list[listIndex + 1]) return;

    const swapped = [...list];
    [swapped[listIndex], swapped[listIndex + 1]] = [
      swapped[listIndex + 1],
      swapped[listIndex],
    ];

    onPickupSelect(swapped[0] ?? null);
    onDropoffSelect(swapped[swapped.length - 1] ?? null);
    setExtraStops(
      swapped.slice(1, -1).map(p => ({
        id: crypto.randomUUID(),
        place: p ?? null,
      })),
    );
  }

  useEffect(() => {
    if (onStopsChange) {
      onStopsChange(extraStops);
    }
  }, [extraStops, onStopsChange]);

  // 🔵 NAVZ AI HANDLER
  async function handleAiAssist() {
    if (!aiPrompt.trim()) return;
  
    setAiLoading(true);
    
    try {
      const res = await fetch("/api/navz-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        console.error("AI Error:", data.error);
        return;
      }
  // Handle Budget/Rate
if (data.budget) {
  setDesiredRate(String(data.budget));
} 
// ✅ Handle Date/Time
if (data.datetime) {
  setScheduleAt(isoToDatetimeLocal(data.datetime));
}

      // Update Pickup
      if (data.pickup) {
        const place = await resolvePlace(data.pickup);
        if (place) onPickupSelect(place);
      }
      
      // Update Dropoff
      if (data.dropoff) {
        const place = await resolvePlace(data.dropoff);
        if (place) onDropoffSelect(place);
      }
      
      // Handle Budget/Rate
      if (data.budget) {
        setDesiredRate(String(data.budget));
      } 
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setAiLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pickupPlace || !dropoffPlace) return;

    setSubmitting(true);

    const stopsPayload = allStops().map((p, i, arr) => ({
      type:
        i === 0
          ? 'pickup'
          : i === arr.length - 1
          ? 'dropoff'
          : 'stop',
      text: p?.name || p?.formatted_address || '',
    }));

    const docRef = await addDoc(collection(db, 'rides'), {
      passengerId,
      createdAt: serverTimestamp(),
      status: 'pending',
      serviceType,
      stops: stopsPayload,
      scheduledAt: scheduleAt
        ? Timestamp.fromDate(new Date(scheduleAt))
        : null,
      desiredRate: desiredRate ? Number(desiredRate) : null,
      otherRiderName:
        serviceType === 'ride_for_others' ? otherName : null,
      itemDescription:
        serviceType === 'item_pickup' ? itemDesc : null,
      itemNotes:
        serviceType === 'item_pickup' ? itemNotes : null,
      routeInfo,
    });

    setSubmitting(false);
    onRideCreated?.(docRef.id);
  }

  const serviceColor =
    serviceType === 'ride'
      ? 'bg-red-500 hover:bg-red-600'
      : serviceType === 'ride_for_others'
      ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
      : 'bg-green-500 hover:bg-green-600';

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <form onSubmit={submit}>
        <CardHeader className="space-y-1">
          <div className="grid grid-cols-3 gap-2">
            <Button type="button" onClick={() => setServiceType('ride')}>
              <User className="mr-1 h-4 w-4" /> Ride
            </Button>
            <Button type="button" onClick={() => setServiceType('ride_for_others')}>
              <Users className="mr-1 h-4 w-4" /> For other
            </Button>
            <Button type="button" onClick={() => setServiceType('item_pickup')}>
              <Package className="mr-1 h-4 w-4" /> Item
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">

          {/* 🔵 NAVZ AI BLOCK */}
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              NAVZ AI
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Describe your ride in plain English…"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAiAssist}
                disabled={aiLoading}
              >
                {aiLoading ? 'Thinking…' : 'Go'}
              </Button>
            </div>
          </div>

          {/* EVERYTHING BELOW IS UNCHANGED */}
          {/* Pickup */}
          <div className="space-y-1">
            <Label>Pickup</Label>
            <div className={destinationWrap}>
              <PlaceAutocompleteInput
                id="pickup"
                placeholder="Enter pickup location"
                value={placeDisplay(pickupPlace)}
                onPlaceSelect={onPickupSelect}
              />
            </div>
          </div>

          {/* Stops */}
          {extraStops.map((s, i) => (
            <div key={s.id} className="space-y-1">
              <Label>{`Stop ${i + 1}`}</Label>
              <div className="flex items-center gap-2">
                <Button type="button" size="icon" variant="ghost" onClick={() => removeStop(s.id)}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
                <div className="flex-1">
                  <div className={destinationWrap}>
                    <PlaceAutocompleteInput
                      id={`stop-${i}`}
                      placeholder={`Stop ${i + 1}`}
                      value={placeDisplay(s.place)}
                      onPlaceSelect={(p) =>
                        setExtraStops(prev =>
                          prev.map(x =>
                            x.id === s.id ? { ...x, place: p } : x,
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dropoff */}
          <div className="space-y-1">
            <Label>Dropoff</Label>
            <div className={destinationWrap}>
              <PlaceAutocompleteInput
                id="dropoff"
                placeholder="Enter dropoff location"
                value={placeDisplay(dropoffPlace)}
                onPlaceSelect={onDropoffSelect}
              />
            </div>
          </div>

          <Button type="button" variant="ghost" className="w-full" onClick={addStop}>
            <Plus className="mr-2 h-4 w-4" /> Add stop
          </Button>

          <Input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} />
          <Input placeholder="Desired rate (optional)" value={desiredRate} onChange={e => setDesiredRate(e.target.value)} />

          {routeInfo && (
            <div className="grid grid-cols-3 gap-2 text-center text-sm bg-muted p-3 rounded">
              <div className="flex flex-col items-center">
                <Clock className="h-4 w-4" />
                {routeInfo.duration}
              </div>
              <div className="flex flex-col items-center">
                <Milestone className="h-4 w-4" />
                {routeInfo.distance}
              </div>
              <div className="flex flex-col items-center">
                <Wallet className="h-4 w-4" />
                Est.
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" className={cn('w-full text-white', serviceColor)} disabled={submitting}>
            {submitting ? 'Requesting…' : 'Request'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
