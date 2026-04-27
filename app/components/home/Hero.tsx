'use client';

import { motion, MotionValue } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { assets } from '../../assets/assets';

interface HeroProps {
  y: MotionValue<number>;
}

export default function Hero({ y }: HeroProps) {
  return (
    <section className='relative h-screen w-full flex items-center justify-center overflow-hidden'>
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y }}
        className='absolute inset-0 z-0'>
        <Image
          src={assets.perfumesHero}
          alt='Hero Perfume'
          fill
          sizes="100vw"
          className='object-cover scale-110'
          priority
        />
        {/* Cinematic Vignette Overlays */}
        <div className='absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-black/80 z-10' />
        <div className='absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent z-10' />
      </motion.div>

      {/* Overlay Content */}
      <div className='relative z-20 max-w-7xl px-6 w-full pt-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-20 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className='space-y-12 md:space-y-16'>
            <div className='space-y-6 md:space-y-8'>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='text-[10px] tracking-[0.8em] uppercase text-rose-300 block font-bold'>
                House of Distinction
              </motion.span>
              <h1 className='text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-prata text-white leading-[0.9] tracking-tighter'>
                Art of <br />
                <span className='italic font-light text-white/90'>Sillage</span>
              </h1>

              <p className='text-white/70 text-xs md:text-sm tracking-[0.15em] max-w-md leading-relaxed font-outfit uppercase border-l border-rose-400/30 pl-6'>
                A legacy of olfactory excellence. <br />
                Crafted in Paris, designed for the modern soul.
              </p>
            </div>

            <div className='flex flex-wrap items-center gap-8 md:gap-12'>
              <Link
                href='/collection'
                className='group flex items-center gap-6 bg-white text-black px-10 py-6 rounded-full text-[10px] font-bold tracking-[0.4em] hover:bg-rose-500 hover:text-white transition-all duration-700 shadow-2xl'>
                EXPLORE COLLECTION
                <div className='h-px w-8 bg-black group-hover:bg-white group-hover:w-12 transition-all' />
              </Link>
            </div>
          </motion.div>

          {/* Removed Floating Luxury Detail */}
        </div>
      </div>

      {/* Cinematic Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className='absolute bottom-12 right-12 flex-col items-center gap-6 z-20 hidden sm:flex'>
        <span className='text-[8px] text-white/40 tracking-[0.5em] uppercase vertical-text'>
          Discover
        </span>
        <div className='w-px h-24 bg-linear-to-b from-white/60 to-transparent' />
      </motion.div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
}
