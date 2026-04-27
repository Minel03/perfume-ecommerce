"use client";

import { useAuthStore } from '@/lib/store/useAuthStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, ExternalLink, Box, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string[];
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_success: boolean;
  created_at: string;
  items: OrderItem[];
  shipping_address: {
    city: string;
  };
  logistics_intel?: string;
}

export default function OrderPage() {
  const { user, loading } = useAuthStore();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const hasVerified = useRef(false);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setLoadingOrders(false);
  }, [user]);

  // 1. Payment Verification Logic
  useEffect(() => {
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    async function verifyPayment() {
      if (success === 'true' && orderId && !hasVerified.current && user) {
        hasVerified.current = true;
        
        // Clear cart immediately on success landing
        clearCart();
        
        // Wipe cloud-sync cart to prevent 'ghost' restoration
        await supabase.from('carts').delete().eq('user_id', user.id);
        
        // 1. Get items from the order first
        const { data: orderData } = await supabase
          .from('orders')
          .select('items')
          .eq('id', orderId)
          .single();

        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'Paid', 
            payment_success: true 
          })
          .eq('id', orderId);

        if (!error && orderData?.items) {
          // 2. Decrement inventory
          try {
            for (const item of (orderData.items as OrderItem[])) {
              const productId = item._id;
              const { data: product } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', productId)
                .single();
              
              if (product) {
                await supabase
                  .from('products')
                  .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
                  .eq('id', productId);
              }
            }
          } catch (invError) {
            console.error('Inventory Sync Error:', invError);
          }

          toast.success('PAYMENT VERIFIED. YOUR MANIFEST IS BEING PREPARED.');
          fetchOrders();
        }
      }
    }

    if (user && !loading) {
      verifyPayment();
    }
  }, [searchParams, user, loading, clearCart, fetchOrders]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const initFetch = async () => {
        await fetchOrders();
      };
      initFetch();
    }
  }, [user, fetchOrders]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-white py-32 md:py-48 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <span className="text-[10px] text-[#FF3B30] font-black tracking-[0.8em] uppercase block mb-6">
            PURCHASE HISTORY
          </span>
          <h1 className="text-6xl md:text-8xl font-prata text-zinc-900 tracking-tighter leading-none">
            Archives
          </h1>
        </div>

        <div className="space-y-12">
          {loadingOrders ? (
            <div className="flex flex-col items-center py-32 space-y-4">
              <Loader2 className="animate-spin text-zinc-200" size={32} />
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400">Retrieving Archives...</p>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group border border-zinc-100 rounded-sm overflow-hidden hover:border-zinc-300 transition-all duration-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center">
                  {/* Order Details */}
                  <div className="flex-1 p-8 lg:p-12 space-y-8">
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
                      <div>
                        <p className="text-[8px] text-zinc-400 tracking-[0.3em] uppercase mb-1">Archive ID</p>
                        <p className="text-[11px] font-bold tracking-widest text-zinc-900 uppercase">#{order.id.slice(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-zinc-400 tracking-[0.3em] uppercase mb-1">Authenticated On</p>
                        <p className="text-[11px] font-bold tracking-widest text-zinc-900 uppercase">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-zinc-400 tracking-[0.3em] uppercase mb-1">Valuation</p>
                        <p className="text-[11px] font-bold tracking-widest text-zinc-900 uppercase">₱{order.total.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[8px] text-zinc-400 tracking-[0.3em] uppercase">Manifest Contents</p>
                      <div className="space-y-3">
                        {order.items.map((item: OrderItem, idx: number) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-1 h-1 bg-[#FF3B30] rounded-full" />
                            <span className="text-[10px] tracking-widest text-zinc-600 uppercase font-bold">
                              {item.quantity} × {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Status Sidebar */}
                  <div className="w-full lg:w-80 bg-zinc-50 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-zinc-100 flex flex-col justify-center">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          {order.status === 'Delivered' ? (
                            <CheckCircle size={16} className="text-[#FF3B30]" />
                          ) : (
                            <Truck size={16} className={`text-zinc-400 ${order.status !== 'Cancelled' ? 'animate-pulse' : ''}`} />
                          )}
                          <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${order.status === 'Paid' || order.status === 'Processing' ? 'text-[#FF3B30]' : 'text-zinc-900'}`}>
                            {order.status}
                          </span>
                        </div>
                        {order.payment_success && (
                          <div className="flex items-center gap-4 text-[#FF3B30]">
                            <CheckCircle size={14} />
                            <span className="text-[8px] font-black tracking-[0.2em] uppercase">Payment Authenticated</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-[8px] text-zinc-400 tracking-[0.3em] uppercase">Shipping Destination</p>
                        <p className="text-[10px] font-bold tracking-widest text-zinc-900 uppercase leading-relaxed">
                          {order.shipping_address.city}
                        </p>
                      </div>

                      <button 
                        onClick={() => toast.success(`CONCIERGE: ${order.logistics_intel || 'YOUR SHIPMENT IS BEING PREPARED FOR THE PRIVATE COURIER.'}`, {
                          icon: '🚚',
                          duration: 5000
                        })}
                        className="flex items-center gap-3 text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
                      >
                        Logistics Intel <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 space-y-8">
              <Box size={48} className="mx-auto text-zinc-100" strokeWidth={1} />
              <p className="text-[11px] text-zinc-400 tracking-[0.4em] uppercase">No previous archives found.</p>
              <Link href="/collection" className="inline-block border-b border-zinc-900 pb-2 text-[10px] font-bold tracking-[0.4em] uppercase">
                Begin Your Journey
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
