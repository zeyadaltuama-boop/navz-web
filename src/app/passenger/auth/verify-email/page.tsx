"use client";

import { auth } from "@/lib/firebase/client";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);

  // 🔁 Check verification status
  async function checkVerified() {
    if (!auth.currentUser) return;

    setChecking(true);
    await auth.currentUser.reload();

    if (auth.currentUser.emailVerified) {
      router.replace("/passenger");
    }

    setChecking(false);
  }

  // 🔁 Auto-check every 3 seconds
  useEffect(() => {
    const interval = setInterval(checkVerified, 3000);
    return () => clearInterval(interval);
  }, []);

  async function resend() {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md p-6 space-y-4 text-center">
      <h1 className="text-2xl font-bold">Verify your email</h1>

      <p className="text-sm text-muted-foreground">
        We sent a verification link to your email.
        You must verify before continuing.
      </p>

      <button
        onClick={resend}
        className="w-full rounded border p-2"
      >
        {sent ? "Email sent again" : "Resend email"}
      </button>

      <button
        onClick={checkVerified}
        disabled={checking}
        className="w-full rounded bg-primary p-2 text-white"
      >
        {checking ? "Checking…" : "I've verified my email"}
      </button>
    </div>
  );
}
