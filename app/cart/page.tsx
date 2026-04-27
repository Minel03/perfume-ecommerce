'use client';

import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { user, loading } = useAuthStore();
  const [calculatingShipping, setCalculatingShipping] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setCalculatingShipping(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      toast.error('PLEASE SIGN IN TO VIEW YOUR CONCIERGE');
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-12">
              <Skeleton className="h-4 w-full" />
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-8">
                  <Skeleton className="w-24 md:w-32 aspect-3/4" />
                  <div className="flex-1 space-y-4 py-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-12"
        >
          <div className="relative">
            <ShoppingBag size={80} className="text-zinc-100 mx-auto" strokeWidth={1} />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-rose-50 rounded-full blur-3xl -z-10"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-prata text-zinc-900 tracking-tight">Your Concierge is empty</h1>
            <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase max-w-xs mx-auto leading-relaxed">
              Discover scents that define your identity and leave a lasting impression.
            </p>
          </div>
          <Link 
            href="/collection" 
            className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-900 border-b border-zinc-900 pb-2 hover:translate-x-2 transition-all duration-500"
          >
            Start Exploring <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-[10px] text-[#FF3B30] font-black tracking-[0.8em] uppercase block mb-6">
            YOUR SELECTION
          </span>
          <h1 className="text-6xl md:text-8xl font-prata text-zinc-900 tracking-tighter leading-none">
            Concierge
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-10">
            <div className="hidden md:grid grid-cols-12 pb-6 border-b border-zinc-100 text-[8px] font-black tracking-[0.4em] text-zinc-400 uppercase">
              <div className="col-span-6">Olfactory Selection</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            <div className="space-y-12">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div 
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-0"
                  >
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-6 flex gap-8">
                      <div className="relative w-24 md:w-32 aspect-3/4 bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0">
                        <Image 
                          src={item.image[0]} 
                          alt={item.name} 
                          fill 
                          sizes="(max-width: 768px) 100px, 150px"
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex flex-col justify-center space-y-3">
                        <p className="text-[11px] font-black tracking-[0.2em] uppercase text-zinc-900">{item.name}</p>
                        <p className="text-[10px] text-zinc-400 tracking-widest uppercase">75ml — Extrait de Parfum</p>
                        <button 
                          onClick={() => {
                            removeItem(item._id);
                            toast.success(`REMOVED ${item.name.toUpperCase()}`);
                          }}
                          className="flex items-center gap-2 text-[9px] font-bold text-zinc-300 hover:text-[#FF3B30] transition-colors uppercase tracking-widest"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-1 md:col-span-3 flex justify-center">
                      <div className="flex items-center border border-zinc-100 rounded-full px-6 py-3 gap-6 bg-zinc-50">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="text-[11px] font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-1 md:col-span-3 text-right">
                      <p className="text-[13px] font-black tracking-widest text-zinc-900">
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="pt-12">
              <Link 
                href="/collection" 
                className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft size={14} /> Continue Exploring
              </Link>
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-zinc-50 border border-zinc-100 p-10 md:p-12 rounded-sm space-y-12">
              <h3 className="text-[10px] font-black tracking-[0.6em] uppercase text-zinc-400 border-b border-zinc-200 pb-6">
                Investment Summary
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-bold text-zinc-900">₱{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span className="text-zinc-400">Estimated Shipping</span>
                  {calculatingShipping ? (
                    <motion.span 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="font-bold text-zinc-400 italic"
                    >
                      CALCULATING...
                    </motion.span>
                  ) : (
                    <span className="font-bold text-zinc-900">CALCULATED AT CHECKOUT</span>
                  )}
                </div>
                <div className="flex justify-between text-[10px] tracking-widest uppercase">
                  <span className="text-zinc-400">Value Added Tax (12%)</span>
                  <span className="font-bold text-zinc-900">₱{(getTotal() * 0.12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-zinc-200">
                  <span className="text-[12px] font-black tracking-[0.4em] uppercase text-zinc-900">Total</span>
                  <span className="text-xl font-black text-zinc-900">
                    ₱{(getTotal() * 1.12).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => router.push('/checkout')}
                  className="group relative w-16 h-16 lg:w-full lg:h-auto lg:py-7 overflow-hidden border border-zinc-900 rounded-full transition-all duration-500 mx-auto lg:mx-0"
                >
                  <span className="absolute inset-0 bg-zinc-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-4 text-zinc-900 transition-colors duration-500 group-hover:text-white uppercase">
                    <span className="hidden lg:inline text-[10px] font-bold tracking-[0.2em] xl:tracking-[0.4em] whitespace-nowrap">
                      Secure Checkout
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <p className="text-[9px] text-zinc-400 text-center uppercase tracking-widest leading-relaxed">
                  Shipping is handled with priority logistics.
                  All scents are insured during transit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
