'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ScentFinderCTA() {
  return (
    <section className='bg-white py-40 md:py-60 overflow-hidden relative'>
      {/* Subtle Background Detail */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-50/30 rounded-full blur-3xl -z-10' />
      
      <div className='max-w-7xl mx-auto px-6 text-center'>
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className='flex flex-col items-center'>
          
          <div className="relative flex flex-col items-center mb-16">
            <motion.span 
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              whileInView={{ opacity: 1, letterSpacing: '1em' }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className='text-[10px] md:text-[11px] text-[#FF3B30] font-black uppercase mb-6 block leading-none font-sans tracking-[1em] ml-[1em]'>
              THE SILLAGE LAB
            </motion.span>
            
            <h2 className='text-7xl md:text-[11rem] font-prata text-zinc-900 leading-[0.8] tracking-tighter'>
              The Collection
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <p className='text-zinc-400 text-[10px] md:text-xs tracking-[0.25em] max-w-lg mx-auto leading-relaxed font-outfit uppercase mb-20'>
              Experience our most iconic creations. A symphony of rare essences crafted for the discerning individual.
            </p>

            <Link
              href='/collection'
              className='group relative px-20 py-6 overflow-hidden border border-zinc-200 rounded-full transition-all duration-500 hover:border-zinc-900'>
              <span className='relative z-10 text-[10px] font-bold tracking-[0.6em] text-zinc-900 transition-colors duration-500 group-hover:text-white uppercase'>
                Explore Now
              </span>
              <span className='absolute inset-0 bg-zinc-900 transform translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0' />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

