'use client';

import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Hero from './components/home/Hero';
import Philosophy from './components/home/Philosophy';
import SecretBoutique from './components/home/SecretBoutique';
import ScentFinderCTA from './components/home/ScentFinderCTA';
import BestSellers from './components/home/BestSellers';

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      className='relative min-h-screen bg-white text-black font-outfit overflow-x-hidden'>
      <Hero y={y1} />

      <Philosophy />
      <SecretBoutique />

      <ScentFinderCTA />

      <BestSellers />
    </div>
  );
}
