'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-white pt-32 pb-24 overflow-hidden'>
      {/* Hero */}
      <section className='px-6 lg:px-12 max-w-7xl mx-auto mb-32'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}>
            <span className='text-[10px] tracking-[0.5em] text-rose-400 font-bold uppercase mb-6 block'>
              Our Legacy
            </span>
            <h1 className='text-7xl lg:text-9xl font-prata tracking-tighter leading-none mb-12 text-zinc-900'>
              Beyond <br />
              <span className='italic pl-12 text-rose-300'>the scent.</span>
            </h1>
            <p className='text-zinc-600 text-lg leading-relaxed font-outfit max-w-md'>
              Sillage was born from a simple observation: that the most powerful
              memories are often the most invisible. We set out to create more
              than just fragrances—we create emotional anchors.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className='relative aspect-4/5 overflow-hidden rounded-sm shadow-2xl'>
            <Image
              src={assets.perfumesHero}
              alt='Lab'
              fill
              className='object-cover'
            />
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className='bg-zinc-50 py-32 px-6 lg:px-12'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-5xl font-prata mb-12 italic text-zinc-800'>
            &quot;A scent is a time machine. It is the only sense that bypasses the
            rational mind and strikes directly at the heart.&quot;
          </h2>
          <div className='w-20 h-px bg-rose-400 mx-auto mb-12' />
          <p className='text-zinc-500 text-sm tracking-widest uppercase font-bold'>
            The Sillage Manifesto
          </p>
        </div>
      </section>

      {/* Grid Layout */}
      <section className='py-32 px-6 lg:px-12 max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
          <div className='space-y-6'>
            <div className='aspect-square relative overflow-hidden bg-gray-100'>
              <Image
                src={assets.perfumesHero1}
                alt='Process'
                fill
                className='object-cover hover:scale-110 transition-transform duration-700'
              />
            </div>
            <h3 className='text-xl font-prata text-zinc-800'>Sustainably Sourced</h3>
            <p className='text-sm text-zinc-600 leading-relaxed'>
              We work directly with growers from Grasse to the Himalayas,
              ensuring every botanical is harvested with respect for the earth.
            </p>
          </div>
          <div className='space-y-6 md:mt-24'>
            <div className='aspect-square relative overflow-hidden bg-gray-100'>
              <Image
                src={assets.perfumesHero}
                alt='Process'
                fill
                className='object-cover hover:scale-110 transition-transform duration-700'
              />
            </div>
            <h3 className='text-xl font-prata text-zinc-800'>Hand-Poured</h3>
            <p className='text-sm text-zinc-600 leading-relaxed'>
              Our perfumes are aged in small batches and bottled by hand in our
              London studio to maintain the integrity of the complex oils.
            </p>
          </div>
          <div className='space-y-6 md:mt-48'>
            <div className='aspect-square relative overflow-hidden bg-gray-100'>
              <Image
                src={assets.perfumesHero1}
                alt='Process'
                fill
                className='object-cover hover:scale-110 transition-transform duration-700'
              />
            </div>
            <h3 className='text-xl font-prata text-zinc-800'>Carbon Neutral</h3>
            <p className='text-sm text-zinc-600 leading-relaxed'>
              From our recycled glass bottles to our biodegradable packaging, we
              ensure your sillage is the only thing you leave behind.
            </p>
          </div>
        </div>
      </section>

      {/* Join the Journey */}
      <section className='py-32 text-center'>
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          className='max-w-xl mx-auto'>
          <h2 className='text-4xl font-prata mb-8 text-zinc-800'>Want to learn more?</h2>
          <Link 
            href='/contact'
            className='inline-block bg-black text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-rose-500 transition-all'>
            CONTACT OUR CONCIERGE
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
