'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  orderBy,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase/client';

function makePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function DriverPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) setUid(user.uid);
      else {
        const cred = await signInAnonymously(auth);
        setUid(cred.user.uid);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'rides'),
      where('status', '==', 'requested'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setRides(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const accept = async (rideId: string) => {
    if (!uid) return;
    await updateDoc(doc(db, 'rides', rideId), {
      status: 'accepted',
      driverId: uid,
      pin: makePin(),
      pinVerified: false,
      acceptedAt: serverTimestamp(),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Driver</h1>
      <p className="text-sm text-muted-foreground">Open requests</p>

      <div className="mt-6 space-y-3">
        {rides.map((r) => (
          <div key={r.id} className="rounded-lg border p-4">
            <div className="font-semibold">{r.type}</div>
            <div className="text-sm text-muted-foreground">
              {r.pickupText} → {r.dropoffText}
            </div>

            <button
              className="mt-3 rounded bg-primary px-4 py-2 text-white"
              onClick={() => accept(r.id)}
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
