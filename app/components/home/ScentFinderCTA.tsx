'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ScentFinderCTA() {
  return (
    <section className='bg-white py-48 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6 text-center'>
        
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className='flex flex-col items-center'>
          
          <div className="relative flex flex-col items-center">
            <span className='text-[10px] tracking-[0.8em] text-rose-400 font-bold uppercase mb-0 block leading-none'>
              Scent Finder
            </span>
            
            <h2 className='text-8xl md:text-[10rem] font-prata text-zinc-900 leading-[0.7] tracking-tighter mb-16 -mt-2 md:-mt-4'>
              Find Your <span className='italic text-rose-300'>Sillage.</span>
            </h2>
          </div>

          <p className='text-zinc-500 text-xs md:text-sm tracking-[0.2em] max-w-lg mx-auto leading-relaxed font-outfit uppercase mb-16'>
            Discover the fragrance that perfectly captures your essence and leaves the impression you desire. An invisible signature, uniquely yours.
          </p>

          <Link
            href='/quiz'
            className='inline-block bg-zinc-900 text-white px-16 py-7 text-[10px] font-bold tracking-[0.6em] rounded-full hover:bg-rose-500 transition-all duration-500 shadow-2xl hover:scale-105'>
            BEGIN DISCOVERY
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
