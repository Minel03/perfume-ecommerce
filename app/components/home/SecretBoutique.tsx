'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  image: string[];
  description: string;
  category: string;
  bestseller: boolean;
}

export default function SecretBoutique() {
  const { user } = useAuthStore();
  const [exclusiveProducts, setExclusiveProducts] = useState<Product[]>([]);
  const hasAccess = user?.user_metadata?.preferences?.exclusive_access;

  useEffect(() => {
    async function fetchExclusiveProducts() {
      if (!hasAccess) return;

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('bestseller', false)
        .limit(3);
      
      if (data) {
        setExclusiveProducts(data.map(p => ({ ...p, _id: p.id })));
      }
    }
    fetchExclusiveProducts();
  }, [hasAccess]);

  // We only show this section if they have the preference enabled
  if (!hasAccess) return null;

  return (
    <section className="py-32 bg-zinc-950 text-white relative overflow-hidden">
      {/* Decorative Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#FF3B30]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-6 max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <ShieldCheck size={16} className="text-[#FF3B30]" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#FF3B30]">
                EXCLUSIVE MEMBER ACCESS
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-prata tracking-tighter leading-none">
              The Secret Lane
            </h2>
            <p className="text-[11px] text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
              Curated limited editions and archive pieces revealed only to our most discerning members.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-500 border border-zinc-800 px-6 py-3 rounded-full">
            <Sparkles size={12} className="text-[#FF3B30]" />
            Unlocked for you
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {exclusiveProducts.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard product={product} isDark={true} />
            </motion.div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-zinc-900 text-center">
          <p className="text-[10px] text-zinc-600 tracking-widest uppercase">
            New archive releases every Friday at Midnight.
          </p>
        </div>
      </div>
    </section>
  );
}
