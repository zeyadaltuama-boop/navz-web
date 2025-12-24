// /home/user/studio/src/components/passenger/driver-profile-card.tsx
'use client';

import React from 'react';
import QRCode from 'qrcode';
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase/client';

type Props = {
  passengerId: string;
  rideId: string;
};

type RideData = {
  status: string;
  createdAt?: any;
  verificationPin?: string | null;
  driverSnapshot?: {
    name?: string;
    photoUrl?: string;
    rating?: number;
    vehicleYear?: number;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleColor?: string;
    plate?: string;
  } | null;
};

export default function DriverProfileCard({ passengerId, rideId }: Props) {
  const [ride, setRide] = React.useState<RideData | null>(null);
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('');

  // cancel modal
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState<string>('');

  React.useEffect(() => {
    const ref = doc(db, 'rides', rideId);
    const unsub = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as any;
      setRide(data);

      const pin = data.verificationPin || '----';
      const payload = JSON.stringify({ rideId, pin });
      try {
        const url = await QRCode.toDataURL(payload, { margin: 1, scale: 6 });
        setQrDataUrl(url);
      } catch {
        setQrDataUrl('');
      }
    });

    return () => unsub();
  }, [rideId]);

  const driver = ride?.driverSnapshot || null;
  const pin = ride?.verificationPin || '----';

  async function handleShareRide() {
    if (!driver) return;

    const msg =
      `NAVZ Ride Share\n` +
      `Driver: ${driver.name || 'N/A'}\n` +
      `Vehicle: ${driver.vehicleYear || ''} ${driver.vehicleMake || ''} ${driver.vehicleModel || ''}\n` +
      `Color: ${driver.vehicleColor || 'N/A'}\n` +
      `Plate: ${driver.plate || 'N/A'}\n` +
      `Ride ID: ${rideId}\n`;

    // Web Share API if available, else clipboard
    try {
      // @ts-ignore
      if (navigator.share) {
        // @ts-ignore
        await navigator.share({ title: 'NAVZ Ride Details', text: msg });
        return;
      }
    } catch {
      // fallthrough
    }

    try {
      await navigator.clipboard.writeText(msg);
      alert('Ride details copied to clipboard.');
    } catch {
      alert(msg);
    }
  }

  function openCancelConfirm() {
    // determine whether under 2 minutes
    const created = ride?.createdAt?.toDate ? ride.createdAt.toDate() : null;
    const now = new Date();
    const diffMs = created ? now.getTime() - created.getTime() : 0;
    const diffMin = diffMs / 60000;

    if (diffMin < 2) {
      setConfirmText('Are you sure you want to cancel this request?');
    } else {
      setConfirmText(
        'Are you sure you want to cancel? 20% will be retained for the driver’s inconvenience.'
      );
    }
    setConfirmOpen(true);
  }

  async function confirmCancel() {
    setConfirmOpen(false);
    const ref = doc(db, 'rides', rideId);
    await updateDoc(ref, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      cancelledBy: 'passenger',
      // NOTE: if you later implement payments, you’ll calculate/charge 20% server-side.
    });
  }

  return (
    <Card className="w-full max-w-sm rounded-xl shadow-2xl">
      <CardContent className="space-y-4 p-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Driver</p>
          <p className="text-lg font-semibold">{driver?.name || 'Waiting for driver…'}</p>
          {driver?.rating != null && (
            <p className="text-sm text-muted-foreground">⭐ {driver.rating.toFixed(1)} rating</p>
          )}
        </div>

        <div className="space-y-1 rounded-lg bg-muted/60 p-3">
          <p className="text-sm font-medium">Vehicle</p>
          <p className="text-sm">
            {driver?.vehicleYear || ''} {driver?.vehicleMake || ''} {driver?.vehicleModel || ''}
          </p>
          <p className="text-sm">Color: {driver?.vehicleColor || 'N/A'}</p>
          <p className="text-sm">Plate: {driver?.plate || 'N/A'}</p>
        </div>

        <div className="rounded-lg bg-muted/60 p-3 text-center">
          <p className="text-sm text-muted-foreground">Verification PIN</p>
          <p className="text-3xl font-bold tracking-widest">{pin}</p>
        </div>

        {qrDataUrl ? (
          <div className="flex items-center justify-center">
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="Ride QR" className="h-28 w-28 rounded-md border bg-white p-2" />
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={handleShareRide} disabled={!driver}>
            Share Ride
          </Button>

          <Button type="button" variant="default">
            Scan QR
          </Button>
        </div>

        {/* Bright red cancel */}
        <Button
          type="button"
          className="w-full bg-red-600 text-white hover:bg-red-700"
          onClick={openCancelConfirm}
        >
          Cancel Ride
        </Button>

        {/* Simple confirm popup */}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-background p-4 shadow-xl">
              <p className="text-sm">{confirmText}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="w-full" onClick={() => setConfirmOpen(false)}>
                  No
                </Button>
                <Button
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                  onClick={confirmCancel}
                >
                  Yes, cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
