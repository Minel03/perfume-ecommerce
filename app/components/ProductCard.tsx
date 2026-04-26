'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: any[];
    description: string;
    bestseller?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='group'>
      <Link
        href={`/products/${product._id}`}
        className='block overflow-hidden relative aspect-3/4 bg-zinc-50'>
        {/* Product Image */}
        <Image
          src={product.image[0]}
          alt={product.name}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-110'
        />

        {/* Quick Add Overlay */}
        <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8 px-6'>
          <button className='w-full bg-white text-black py-4 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500'>
            <ShoppingBag size={14} />
            QUICK ADD
          </button>
        </div>

        {/* Badge */}
        {product.bestseller && (
          <div className='absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-bold tracking-widest uppercase'>
            Best Seller
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className='mt-6 text-center'>
        <Link
          href={`/products/${product._id}`}
          className='block'>
          <h3 className='text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 group-hover:text-rose-500 transition-colors'>
            {product.name}
          </h3>
          <p className='mt-1 text-[10px] text-gray-400 italic'>Eau de Parfum</p>
          <div className='mt-4 flex items-center justify-center gap-3'>
            <span className='h-px w-4 bg-gray-200' />
            <p className='text-sm font-medium font-outfit tracking-tight text-gray-900'>
              ₱{product.price.toLocaleString()}
            </p>
            <span className='h-px w-4 bg-gray-200' />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
