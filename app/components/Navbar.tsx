'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  LogOut,
  Package,
  UserCircle,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../assets/assets';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Clear search when opened
  useEffect(() => {
    if (isSearchOpen) setSearchQuery('');
  }, [isSearchOpen]);

  // Click away listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pages that feature a dark hero image at the very top (full-width)
  const hasDarkHero = ['/', '/contact'].includes(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'COLLECTION', href: '/collection' },
    { name: 'DISCOVER', href: '/quiz' },
    { name: 'MANIFESTO', href: '/about' },
  ];

  // Determine text color based on scroll and page type
  const isLightText = !scrolled && hasDarkHero;
  const textColorClass = isLightText ? 'text-white' : 'text-zinc-900';
  const logoSubColorClass = isLightText ? 'text-rose-300' : 'text-rose-500';

  const filteredProducts =
    searchQuery.length > 2
      ? products
          .filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 4)
      : [];

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-700 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md py-4 border-b border-zinc-100 shadow-sm'
            : 'bg-transparent py-8'
        }`}>
        <div className='mx-auto grid grid-cols-3 items-center max-w-[1800px] px-6 lg:px-12'>
          {/* Left Navigation (Desktop) */}
          <div className='hidden lg:flex items-center gap-6 xl:gap-10'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] font-bold tracking-[0.3em] transition-all duration-500 hover:text-rose-500 whitespace-nowrap ${textColorClass}`}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle (Left on Mobile) */}
          <div className='lg:hidden flex justify-start'>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={textColorClass}>
              <Menu
                size={20}
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Center Logo */}
          <div className='flex justify-center'>
            <Link
              href='/'
              className='group flex flex-col items-center'>
              <span
                className={`font-prata text-2xl md:text-3xl xl:text-4xl tracking-[0.3em] transition-all duration-1000 ${textColorClass}`}>
                SILLAGE
              </span>
              <span
                className={`text-[8px] tracking-[0.6em] mt-1 transition-all duration-1000 ${logoSubColorClass}`}>
                PARIS
              </span>
            </Link>
          </div>

          {/* Right Navigation / Actions */}
          <div className='flex items-center justify-end gap-4 md:gap-6 xl:gap-8'>
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`transition-colors hover:text-rose-500 ${textColorClass}`}>
              <Search
                size={18}
                strokeWidth={1.2}
              />
            </button>

            {/* Profile Clickable Menu */}
            <div
              className='relative hidden md:block'
              ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`transition-colors hover:text-rose-500 flex items-center gap-2 ${textColorClass}`}>
                <User
                  size={18}
                  strokeWidth={1.2}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className='absolute right-0 top-full pt-4 z-100'>
                    <div className='bg-white border border-zinc-100 shadow-2xl rounded-sm w-48 overflow-hidden'>
                      <Link
                        href='/profile'
                        onClick={() => setIsProfileOpen(false)}
                        className='flex items-center gap-3 px-6 py-4 text-[10px] font-bold tracking-widest text-zinc-900 hover:bg-rose-50 transition-colors border-b border-zinc-50'>
                        <UserCircle
                          size={14}
                          strokeWidth={1.5}
                        />
                        PROFILE
                      </Link>
                      <Link
                        href='/order'
                        onClick={() => setIsProfileOpen(false)}
                        className='flex items-center gap-3 px-6 py-4 text-[10px] font-bold tracking-widest text-zinc-900 hover:bg-rose-50 transition-colors border-b border-zinc-50'>
                        <Package
                          size={14}
                          strokeWidth={1.5}
                        />
                        ORDERS
                      </Link>
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className='flex items-center gap-3 w-full px-6 py-4 text-[10px] font-bold tracking-widest text-rose-500 hover:bg-rose-50 transition-colors text-left'>
                        <LogOut
                          size={14}
                          strokeWidth={1.5}
                        />
                        LOGOUT
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href='/cart'
              className='group flex items-center gap-3'>
              <div className='relative'>
                <ShoppingBag
                  size={20}
                  strokeWidth={1.2}
                  className={textColorClass}
                />
                <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white'>
                  0
                </span>
              </div>
              <span
                className={`hidden xl:block text-[10px] font-bold tracking-[0.2em] ${textColorClass}`}>
                CONCIERGE
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Full-Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-100 bg-white/98 backdrop-blur-xl flex flex-col items-center pt-32 px-6'>
            <button
              onClick={() => setIsSearchOpen(false)}
              className='absolute top-12 right-12 text-zinc-900 hover:text-rose-500 transition-colors'>
              <X
                size={32}
                strokeWidth={1}
              />
            </button>

            <div className='max-w-4xl w-full space-y-12'>
              <div className='relative'>
                <input
                  autoFocus
                  type='text'
                  placeholder='Search Fragrances...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full bg-transparent border-b-2 border-zinc-200 py-8 text-4xl md:text-6xl font-prata text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-rose-300 transition-colors'
                />
                <Search
                  size={32}
                  className='absolute right-0 top-1/2 -translate-y-1/2 text-zinc-200'
                />
              </div>

              {/* Search Results Preview */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      router.push(`/products/${product._id}`);
                      setIsSearchOpen(false);
                    }}
                    className='group cursor-pointer space-y-4'>
                    <div className='aspect-4/5 relative bg-zinc-50 overflow-hidden'>
                      <Image
                        src={product.image[0]}
                        alt={product.name}
                        fill
                        className='object-cover group-hover:scale-110 transition-all duration-700'
                      />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-900'>
                        {product.name}
                      </p>
                      <p className='text-[10px] text-zinc-400 italic'>
                        ₱{product.price.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {searchQuery.length > 2 && filteredProducts.length === 0 && (
                <p className='text-zinc-400 font-prata text-xl'>
                  No scents found for "{searchQuery}"
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-60 bg-zinc-900 text-white p-8'>
            <div className='flex justify-between items-center mb-20'>
              <span className='font-prata text-xl tracking-widest'>
                SILLAGE
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X
                  size={24}
                  strokeWidth={1}
                />
              </button>
            </div>

            <div className='flex flex-col space-y-8'>
              {[
                'HOME',
                'COLLECTION',
                'DISCOVER',
                'MANIFESTO',
                'ACCOUNT',
                'CONTACT',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <Link
                    href={
                      item === 'HOME'
                        ? '/'
                        : item === 'MANIFESTO'
                          ? '/about'
                          : item === 'DISCOVER'
                            ? '/quiz'
                            : `/${item.toLowerCase()}`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='text-5xl md:text-7xl font-prata tracking-tighter hover:text-rose-400 transition-colors'>
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className='absolute bottom-12 left-8 right-8 flex justify-between items-end'>
              <div className='space-y-2'>
                <p className='text-[8px] tracking-[0.3em] text-zinc-500 uppercase'>
                  Follow us
                </p>
                <div className='flex gap-12 text-[10px] font-bold tracking-[0.3em] uppercase'>
                  <span className='hover:text-rose-500 cursor-pointer transition-colors'>
                    Instagram
                  </span>
                  <span className='hover:text-rose-500 cursor-pointer transition-colors'>
                    Facebook
                  </span>
                  <span className='hover:text-rose-500 cursor-pointer transition-colors'>
                    Twitter
                  </span>
                </div>
              </div>
              <p className='text-[8px] tracking-[0.2em] text-zinc-500'>
                © 2024 SILLAGE LAB
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
