'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-black text-white py-32 px-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20'>
        <div className='md:col-span-2'>
          <span className='font-prata text-5xl tracking-tighter mb-8 block text-white'>
            SILLAGE.
          </span>
          <p className='text-zinc-400 text-sm leading-relaxed max-w-xs'>
            Crafting premium olfactory experiences for the modern soul. Based in
            Paris, shipping worldwide.
          </p>
        </div>
        <div className='space-y-6'>
          <h4 className='text-[10px] font-bold tracking-[0.3em] text-rose-400'>
            EXPLORE
          </h4>
          <ul className='space-y-4 text-xs text-zinc-400 font-outfit'>
            <li>
              <Link
                href='/collection'
                className='hover:text-white transition-colors'>
                The Collection
              </Link>
            </li>
            <li>
              <Link
                href='/about'
                className='hover:text-white transition-colors'>
                Our Manifesto
              </Link>
            </li>
            <li>
              <Link
                href='/quiz'
                className='hover:text-white transition-colors'>
                Scent Finder
              </Link>
            </li>
          </ul>
        </div>
        <div className='space-y-6'>
          <h4 className='text-[10px] font-bold tracking-[0.3em] text-rose-400'>
            NEWSLETTER
          </h4>
          <div className='flex border-b border-zinc-800 pb-2'>
            <input
              type='email'
              placeholder='Your email address'
              className='bg-transparent border-none text-xs focus:ring-0 w-full text-white'
            />
            <button className='text-[10px] font-bold tracking-widest hover:text-rose-400 transition-colors'>
              JOIN
            </button>
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto mt-32 pt-8 border-t border-zinc-900 text-center'>
        <span className='text-[8px] text-zinc-500 tracking-[0.5em] uppercase'>
          © 2026 SILLAGE. ALL RIGHTS RESERVED.
        </span>
      </div>
    </footer>
  );
}
