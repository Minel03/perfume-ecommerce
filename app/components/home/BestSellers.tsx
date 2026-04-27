'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from '../Skeleton';

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  image: string[];
}

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('bestseller', true)
        .limit(6);
      
      if (data) {
        setBestSellers(data.map(p => ({ ...p, _id: p.id })));
      }
      setLoading(false);
    }
    fetchBestSellers();
  }, []);

  return (
    <section className='py-48 bg-white'>
      <div className='px-6 mb-24 text-center max-w-7xl mx-auto'>
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className='text-[10px] tracking-[0.6em] text-rose-500 uppercase font-bold mb-4 block'>
          Curation
        </motion.span>
        <h2 className='text-6xl font-prata text-zinc-900 tracking-tighter'>The Best Sellers</h2>
      </div>

      <div className='flex gap-12 overflow-x-auto pb-24 px-6 md:px-24 no-scrollbar scrollbar-hide'>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className='min-w-[320px] md:min-w-[400px] shrink-0 space-y-8'>
              <Skeleton className="aspect-3/4 w-full" />
              <div className="space-y-4 flex flex-col items-center">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))
        ) : (
          bestSellers.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className='min-w-[320px] md:min-w-[400px] shrink-0 group cursor-pointer'>
              <Link href={`/products/${product._id}`}>
                <div className='relative aspect-3/4 bg-zinc-50 mb-8 overflow-hidden rounded-sm border border-zinc-100'>
                  <Image
                    src={product.image[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className='object-cover transition-transform duration-1000 group-hover:scale-110'
                  />
                  {/* Minimalist Price Badge */}
                  <div className='absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 text-[10px] font-bold tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0'>
                    ₱{product.price.toLocaleString()}
                  </div>
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-[11px] font-bold tracking-[0.4em] uppercase text-zinc-900 group-hover:text-rose-500 transition-colors'>
                    {product.name}
                  </h3>
                  <p className='text-[10px] text-zinc-400 italic tracking-widest'>Extrait de Parfum</p>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      <div className='text-center mt-12'>
        <Link
          href='/collection'
          className='inline-block text-[10px] font-bold tracking-[0.5em] uppercase border-b border-zinc-200 pb-2 hover:border-zinc-900 transition-all'>
          View All Fragrances
        </Link>
      </div>
    </section>
  );
}
