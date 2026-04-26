'use client';

import { use, useState } from 'react';
import { products } from '../../assets/assets';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = products.find((p) => p._id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <h1 className='text-2xl font-prata'>Product not found</h1>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <div className='min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-start'>
          {/* Left: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='sticky top-32 space-y-4'>
            <div className='relative aspect-4/5 bg-zinc-50 overflow-hidden rounded-sm'>
              <Image
                src={product.image[0]}
                alt={product.name}
                fill
                className='object-cover'
                priority
              />
            </div>
            <div className='grid grid-cols-4 gap-4'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='aspect-square bg-zinc-100 rounded-sm cursor-pointer hover:opacity-80 transition-opacity'
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-12'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-rose-500'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill='currentColor'
                    />
                  ))}
                </div>
                <span className='text-[10px] font-bold tracking-widest uppercase'>
                  4.9 (128 Reviews)
                </span>
              </div>
              <h1 className='text-5xl md:text-6xl font-prata text-zinc-900 tracking-tight leading-tight'>
                {product.name}
              </h1>
              <p className='text-2xl font-outfit text-zinc-900 font-medium'>
                ₱{product.price.toLocaleString()}
              </p>
            </div>

            <p className='text-zinc-600 leading-relaxed font-outfit'>
              {product.description}. A masterful composition that balances
              traditional elegance with contemporary edge. Designed for those
              who seek to leave a lasting, sophisticated trail.
            </p>

            {/* Dynamic Olfactive Pyramid */}
            <div className='py-8 border-y border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='space-y-2'>
                <p className='text-[8px] font-bold tracking-[0.3em] uppercase text-rose-500'>
                  Top Notes
                </p>
                <p className='text-sm font-prata text-zinc-800'>
                  {product.notes?.top || 'Bergamot, Lemon'}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-[8px] font-bold tracking-[0.3em] uppercase text-rose-500'>
                  Heart Notes
                </p>
                <p className='text-sm font-prata text-zinc-800'>
                   {product.notes?.heart || 'Rose, Jasmine'}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-[8px] font-bold tracking-[0.3em] uppercase text-rose-500'>
                  Base Notes
                </p>
                <p className='text-sm font-prata text-zinc-800'>
                  {product.notes?.base || 'Amber, Musk'}
                </p>
              </div>
            </div>

            {/* Selection & Add to Cart */}
            <div className='space-y-8'>
              <div className='flex items-center gap-8'>
                <div className='flex items-center border border-zinc-200 rounded-full px-6 py-3 gap-6 text-zinc-900'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='hover:text-rose-500 transition-colors'>
                    <Minus
                      size={14}
                      strokeWidth={3}
                    />
                  </button>
                  <span className='text-sm font-bold w-4 text-center'>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className='hover:text-rose-500 transition-colors'>
                    <Plus
                      size={14}
                      strokeWidth={3}
                    />
                  </button>
                </div>
                <button className='flex-1 bg-black text-white py-5 text-[10px] font-bold tracking-[0.4em] uppercase rounded-full hover:bg-rose-500 transition-all flex items-center justify-center gap-3'>
                  <ShoppingBag size={16} />
                  ADD TO CONCIERGE
                </button>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex items-center gap-3 p-4 bg-zinc-50 rounded-sm'>
                  <Truck
                    size={18}
                    strokeWidth={2}
                    className='text-zinc-800'
                  />
                  <p className='text-[10px] font-bold tracking-widest uppercase text-zinc-800'>
                    Global Delivery
                  </p>
                </div>
                <div className='flex items-center gap-3 p-4 bg-zinc-50 rounded-sm'>
                  <RotateCcw
                    size={18}
                    strokeWidth={2}
                    className='text-zinc-800'
                  />
                  <p className='text-[10px] font-bold tracking-widest uppercase text-zinc-800'>
                    30-Day Returns
                  </p>
                </div>
              </div>
            </div>

            {/* Authenticity Guarantee */}
            <div className='flex items-center gap-4 text-zinc-600 border-t border-zinc-100 pt-8'>
              <ShieldCheck
                size={20}
                strokeWidth={2}
              />
              <p className='text-[10px] font-bold tracking-[0.2em] uppercase'>
                100% Authentic Sillage Guarantee
              </p>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className='mt-48'>
            <h2 className='text-3xl font-prata mb-12 text-zinc-900'>
              Complementary Scents
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
