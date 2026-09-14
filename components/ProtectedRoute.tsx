'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  // Unverified accounts may hold a session (register keeps them signed in,
  // blocked logins stay signed in) but must not use the app until verified.
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setVerified(false);
      router.push('/auth/login');
      return;
    }
    setVerified(false);
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (cancelled) return;
        if (!snap.exists() || snap.data()?.isVerified !== true) {
          router.push(
            `/auth/verify-email?uid=${user.uid}&email=${encodeURIComponent(user.email ?? '')}`
          );
          return;
        }
        setVerified(true);
      } catch (error) {
        console.error('Failed to check verification status:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loading, router]);

  if (loading || !user || !verified) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return <>{children}</>;
};

export default ProtectedRoute;
