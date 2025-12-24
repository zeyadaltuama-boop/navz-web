"use client";

import { useEffect, useState } from "react";
import PassengerVerifyGuard from "@/components/passenger/auth/PassengerVerifyGuard";
import { auth } from "@/lib/firebase/client";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { nanoid } from "nanoid";

type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  note: string;
};

export default function PassengerProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nickname, setNickname] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [avatarSeed, setAvatarSeed] = useState("");

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // LOAD PROFILE
  useEffect(() => {
    if (!user) return;
    const currentUser = user;

    async function loadProfile() {
      const ref = doc(db, "passengers", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setNickname(data.nickname ?? "");
        setFullName(data.fullName ?? "");
        setPhone(data.phone ?? "");
        setEmail(data.email ?? currentUser.email ?? "");
        setAvatarSeed(data.avatarSeed ?? currentUser.uid);
        setEmergencyContacts(data.emergencyContacts ?? []);
      } else {
        setAvatarSeed(currentUser.uid);
        setEmail(currentUser.email ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [user]);

  function regenerateAvatar() {
    setAvatarSeed(nanoid());
  }

  function addEmergencyContact() {
    setEmergencyContacts((prev) => [
      ...prev,
      { id: nanoid(), name: "", phone: "", note: "" },
    ]);
  }

  function updateEmergencyContact(
    id: string,
    field: keyof EmergencyContact,
    value: string
  ) {
    setEmergencyContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  function removeEmergencyContact(id: string) {
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));
  }

  async function saveProfile() {
    if (!user) return;
    const currentUser = user;

    if (!nickname.trim()) {
      alert("Nickname is required.");
      return;
    }

    setSaving(true);

    await setDoc(
      doc(db, "passengers", currentUser.uid),
      {
        nickname,
        fullName,
        phone,
        email,
        avatarSeed,
        emergencyContacts,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setSaving(false);
    alert("Profile saved");
  }

  if (loading) {
    return <div className="p-6 text-center">Loading profile…</div>;
  }

  return (
    <PassengerVerifyGuard>
      <div className="mx-auto max-w-xl p-6 space-y-8">
        <h1 className="text-2xl font-bold text-center">Your Profile</h1>

        {/* AVATAR */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Avatar</label>

          <div className="flex items-center gap-4">
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${avatarSeed}`}
              className="h-16 w-16 rounded-full border"
            />
            <button
              type="button"
              onClick={regenerateAvatar}
              className="text-sm text-primary"
            >
              Regenerate
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            For your privacy, NAVZ does not support real photos.
          </p>
        </div>

        {/* BASIC INFO */}
        <input
          className="w-full rounded border p-2"
          placeholder="Nickname (shown to driver)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* EMERGENCY CONTACTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Emergency Contacts</h2>
            <button
              type="button"
              onClick={addEmergencyContact}
              className="text-primary font-medium"
            >
              + Add
            </button>
          </div>

          {emergencyContacts.map((c) => (
            <div key={c.id} className="space-y-2 rounded border p-3">
              <input
                className="w-full rounded border p-2"
                placeholder="Contact Name"
                value={c.name}
                onChange={(e) =>
                  updateEmergencyContact(c.id, "name", e.target.value)
                }
              />
              <input
                className="w-full rounded border p-2"
                placeholder="Phone Number"
                value={c.phone}
                onChange={(e) =>
                  updateEmergencyContact(c.id, "phone", e.target.value)
                }
              />
              <input
                className="w-full rounded border p-2"
                placeholder="Relationship / Notes"
                value={c.note}
                onChange={(e) =>
                  updateEmergencyContact(c.id, "note", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeEmergencyContact(c.id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full rounded bg-primary p-2 text-white"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </PassengerVerifyGuard>
  );
}
