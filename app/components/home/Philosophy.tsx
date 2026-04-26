'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { assets, products } from '../../assets/assets';

export default function Philosophy() {
  return (
    <section className='py-48 px-6 overflow-hidden'>
      <div className='max-w-[1440px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-20 items-start mb-32'>
          <div className='flex-1'>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className='text-[10px] tracking-[0.6em] text-rose-500 uppercase font-bold mb-8 block'>
              Our Narrative
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className='text-6xl md:text-8xl font-prata leading-[0.9] text-zinc-900 mb-12 tracking-tighter'>
              The Invisible <br />
              <span className='italic font-light'>Architecture</span>
            </motion.h2>
          </div>
          <div className='flex-1 md:pt-20'>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='text-zinc-500 text-sm leading-relaxed max-w-sm mb-12 font-outfit uppercase tracking-widest'>
              WE DON'T JUST CREATE PERFUMES; WE CAPTURE MOMENTS. EACH BOTTLE OF SILLAGE IS A TESTAMENT TO THE ART OF SUBTLE PRESENCE—THE SCENT TRAIL THAT REMAINS WHEN YOU LEAVE THE ROOM.
            </motion.p>
            <Link
              href='/about'
              className='group flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase transition-all'>
              <span className='group-hover:mr-4 transition-all'>View Manifesto</span>
              <div className='h-px w-12 bg-zinc-900 group-hover:w-20 transition-all' />
            </Link>
          </div>
        </div>

        {/* Editorial Masonry Grid */}
        <div className='grid grid-cols-1 md:grid-cols-12 gap-12 h-[900px]'>
          {/* Main Editorial Piece */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 100 }}
            transition={{ duration: 1.5 }}
            className='md:col-span-8 relative overflow-hidden group'>
            <Image
              src={assets.perfumesHero1}
              alt='Editorial'
              fill
              className='object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105'
            />
            {/* Top-left overlay for text legibility */}
            <div className='absolute inset-0 bg-linear-to-br from-black/60 via-transparent to-transparent opacity-80' />
            <div className='absolute top-12 left-12 text-white z-10'>
              <span className='text-[10px] tracking-[0.5em] uppercase font-bold text-rose-300'>Series 01</span>
              <h3 className='text-6xl md:text-8xl font-prata mt-4 leading-[0.8] tracking-tighter'>Essence of <br/> Shadow</h3>
            </div>
          </motion.div>

          {/* Side Elements */}
          <div className='md:col-span-4 flex flex-col gap-12'>
            {/* Scent Detail */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 50 }}
              className='flex-1 relative bg-zinc-50 overflow-hidden group border border-zinc-100'>
              <Image
                src={products[12].image[0]}
                alt='MAN Black Shadow'
                className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-3'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60' />
              <div className='absolute bottom-8 left-8 z-10'>
                <span className='text-[8px] font-bold tracking-[0.2em] uppercase text-rose-300'>The Scent Trail</span>
                <h4 className='text-lg font-prata mt-1 text-white'>Black Shadow</h4>
              </div>
            </motion.div>

            {/* Atmosphere Piece */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 50 }}
              transition={{ delay: 0.3 }}
              className='flex-1 relative overflow-hidden group grayscale'>
              <Image
                src={assets.perfumesHero}
                alt='Atmosphere'
                fill
                className='object-cover group-hover:scale-110 transition-transform duration-1000'
              />
              <div className='absolute inset-0 bg-zinc-900/40 group-hover:bg-zinc-900/10 transition-colors' />
              <div className='absolute inset-0 flex items-center justify-center'>
                 <span className='text-[8px] text-white/40 tracking-[1em] uppercase -rotate-90'>Atmosphere</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
