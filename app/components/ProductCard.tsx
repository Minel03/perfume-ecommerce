'use client';

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: (string | StaticImageData)[];
    description: string;
    category?: string;
    bestseller?: boolean;
  };
  isDark?: boolean;
}

export default function ProductCard({ product, isDark = false }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const profile = user?.user_metadata?.scent_profile;
  let matchPercent = 0;

  if (profile) {
    if (profile.category === product.category) matchPercent += 60;
    if (product.description.toLowerCase().includes(profile.vibe?.toLowerCase()))
      matchPercent += 30;
    
    // Stable variability based on product ID (prevents impurity errors)
    if (matchPercent > 0) {
      const seed = parseInt(product._id.slice(-1), 16) || 0;
      matchPercent += (seed % 9) + 1;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='group relative'>
      
      {/* Scent Aura (Visual Scent Halo) */}
      <div className={`absolute -inset-8 blur-[60px] opacity-0 group-hover:opacity-50 transition-all duration-1000 pointer-events-none ${
        product.category === 'men' ? 'bg-orange-500/50' :
        product.category === 'women' ? 'bg-rose-500/50' :
        'bg-sky-500/50'
      }`} />

      <Link
        href={`/products/${product._id}`}
        className='block overflow-hidden relative aspect-3/4 bg-zinc-50'>

        {/* Product Image */}
        <Image
          src={
            product.image?.[0] && product.image[0] !== '{}'
              ? product.image[0]
              : 'https://images.unsplash.com/photo-1594432250843-b173fcfcf89a?q=80&w=1000&auto=format&fit=crop'
          }
          alt={product.name}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
          className='object-cover transition-transform duration-700 group-hover:scale-110'
        />

        {/* Quick Add Overlay */}
        <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8 px-6'>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
              toast.success(`${product.name.toUpperCase()} ADDED TO MANIFEST`);
            }}
            className='w-full bg-white text-black py-4 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500'>
            <ShoppingBag size={14} />
            QUICK ADD
          </button>
        </div>

        {/* Badges */}
        <div className='absolute top-4 left-4 flex flex-col gap-2'>
          {product.bestseller && (
            <div className='bg-black text-white px-3 py-1 text-[8px] font-bold tracking-widest uppercase'>
              Best Seller
            </div>
          )}
          {matchPercent > 0 && (
            <div className='bg-linear-to-r from-[#FF3B30] to-orange-500 text-white px-3 py-1 text-[8px] font-black tracking-widest uppercase rounded-full shadow-lg'>
              {matchPercent}% Match For You
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className='mt-6 text-center'>
        <Link
          href={`/products/${product._id}`}
          className='block'>
          <h3 className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-colors ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-rose-500`}>
            {product.name}
          </h3>
          <p className={`mt-1 text-[10px] italic ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Eau de Parfum</p>
          <div className='mt-4 flex items-center justify-center gap-3'>
            <span className={`h-px w-4 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
            <p className={`text-sm font-medium font-outfit tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ₱{product.price.toLocaleString()}
            </p>
            <span className={`h-px w-4 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
