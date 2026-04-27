'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useCartStore } from '@/lib/store/useCartStore';

export default function CartSync() {
  const { user, loading: authLoading } = useAuthStore();
  const { items, setItems } = useCartStore();
  const isInitialMount = useRef(true);
  const isSyncingFromDB = useRef(false);

  // 1. Initial Load: Sync from Database to Store
  useEffect(() => {
    async function fetchCartFromDB() {
      if (!user || authLoading) return;

      isSyncingFromDB.current = true;
      const { data, error } = await supabase
        .from('carts')
        .select('items')
        .eq('user_id', user.id)
        .single();

      if (!error && data?.items) {
        // Only set if items are different to avoid loops
        setItems(data.items);
      }
      
      isSyncingFromDB.current = false;
      isInitialMount.current = false;
    }

    fetchCartFromDB();
  }, [user, authLoading, setItems]);

  // 2. Continuous Sync: Store to Database
  useEffect(() => {
    async function syncCartToDB() {
      // Don't sync if we haven't finished auth or if we are currently pulling from DB
      if (!user || isSyncingFromDB.current || isInitialMount.current) return;

      const { error } = await supabase
        .from('carts')
        .upsert({
          user_id: user.id,
          items: items,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error syncing cart to DB:', error.message, error.details, error.hint);
      }
    }

    // Debounce the sync to avoid too many writes
    const timeout = setTimeout(syncCartToDB, 1000);
    return () => clearTimeout(timeout);
  }, [items, user]);

  return null; // This is a logic-only component
}
