'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function register() {
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);

      router.push('/auth/verify-email');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>

      <input
        className="w-full rounded border p-2"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full rounded border p-2"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <input
        type="password"
        className="w-full rounded border p-2"
        placeholder="Confirm password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={register}
        disabled={loading}
        className="w-full rounded bg-primary p-2 text-white"
      >
        {loading ? 'Creating…' : 'Create account'}
      </button>
    </div>
  );
}
