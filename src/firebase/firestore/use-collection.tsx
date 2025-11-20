'use client';

import { useEffect, useState, useRef } from 'react';
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

export function useCollection(queryRef: Query<DocumentData> | null) {
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const queryRefMemo = useRef(queryRef);

  useEffect(() => {
    if (!queryRefMemo.current) {
        setData([]);
        setLoading(false);
        return;
    }
    
    setLoading(true);
    const unsubscribe = onSnapshot(
      queryRefMemo.current,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryRef?.path, queryRef?._query.filters]);

  return { data, loading, error };
}
