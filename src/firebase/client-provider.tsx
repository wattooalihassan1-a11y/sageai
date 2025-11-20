'use client';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, setServices] = useState<{
    firebaseApp: FirebaseApp,
    auth: Auth,
    firestore: Firestore,
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      const firebaseServices = await initializeFirebase();
      setServices(firebaseServices);
    };
    init();
  }, []);

  if (!services) {
    return null; 
  }

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
