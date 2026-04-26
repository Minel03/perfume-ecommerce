'use client';

import { useState } from 'react';
import { products } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState('featured');
  const [filterType, setFilterType] = useState('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = products.filter((item) => {
    if (filterType === 'all') return true;
    return item.category === filterType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'featured') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    return 0;
  });

  const FilterButtons = ({ mobile = false }) => (
    <div className={`${mobile ? 'flex flex-col gap-8' : 'flex gap-6'} text-zinc-500`}>
      {['ALL', 'MEN', 'WOMEN', 'UNISEX'].map((type) => (
        <button
          key={type}
          onClick={() => {
            setFilterType(type.toLowerCase());
            if (mobile) setIsMobileFilterOpen(false);
          }}
          className={`text-left hover:text-black transition-colors ${
            filterType === type.toLowerCase()
              ? 'text-black font-bold border-b-2 border-rose-500 pb-1'
              : ''
          }`}>
          {type}
        </button>
      ))}
    </div>
  );

  return (
    <div className='min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12'>
      {/* Header */}
      <header className='max-w-7xl mx-auto mb-20'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center'>
          <span className='text-[10px] tracking-[0.5em] text-rose-500 font-bold uppercase mb-4 block'>
            The Sillage Lab
          </span>
          <h1 className='text-6xl md:text-8xl font-prata tracking-tight mb-8 text-zinc-900'>
            The Collection
          </h1>
          <p className='max-w-2xl mx-auto text-zinc-600 text-sm leading-relaxed font-outfit'>
            Explore our curated selection of fine fragrances, each crafted to
            leave a lasting impression.
          </p>
        </motion.div>
      </header>

      {/* Toolbar */}
      <div className='max-w-7xl mx-auto mb-12 flex flex-row justify-between items-center py-6 border-y border-zinc-100'>
        <div className='flex items-center gap-8 text-[10px] font-bold tracking-widest uppercase'>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className='flex items-center gap-2 text-zinc-900 hover:text-rose-500 transition-colors md:hidden'
          >
            <Filter size={14} /> FILTER
          </button>
          
          <div className='hidden md:block'>
            <FilterButtons />
          </div>
        </div>

        <div className='relative flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase'>
          <span className='text-zinc-500 hidden sm:inline'>SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='bg-transparent border-none focus:ring-0 cursor-pointer pr-8 py-0 font-bold text-zinc-900 uppercase'>
            <option value='featured'>FEATURED</option>
            <option value='price-low'>PRICE: LOW-HIGH</option>
            <option value='price-high'>PRICE: HIGH-LOW</option>
          </select>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden'>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className='absolute left-0 top-0 h-full w-4/5 bg-white p-12'>
              <div className='flex justify-between items-center mb-16'>
                <span className='text-[10px] font-bold tracking-[0.4em] uppercase'>Filters</span>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <FilterButtons mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16'>
        {sortedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className='text-center py-32'>
          <p className='text-zinc-600 font-prata italic text-xl'>
            No fragrances found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
