'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowUpRight, Star } from 'lucide-react';
import Image from 'next/image';

import { Product, Order } from '../../admin/page';

interface DashboardProps {
  products: Product[];
  orders: Order[];
}

export default function DashboardTab({ products, orders }: DashboardProps) {
  const confirmedStatuses = ['Paid', 'Processing', 'Shipped', 'Delivered'];
  const totalRevenue = orders
    .filter(o => o.payment_success || confirmedStatuses.includes(o.status))
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
  const bestsellers = products.filter(p => p.bestseller).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Total Revenue" 
          value={`₱${totalRevenue.toLocaleString()}`} 
          icon={<ArrowUpRight className="text-[#FF3B30]" size={20} />} 
        />
        <StatCard 
          label="Active Manifests" 
          value={activeOrders.toString()} 
          icon={<ShoppingBag className="text-zinc-500" size={20} />} 
        />
        <StatCard 
          label="Curated Bestsellers" 
          value={bestsellers.toString()} 
          icon={<Star className="text-yellow-500" size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-prata">Recent Inventory</h2>
          <div className="space-y-4">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-6 bg-zinc-900/30 border border-zinc-900 rounded-sm">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-16 relative bg-zinc-800">
                    <Image 
                      src={product.image?.[0] || 'https://images.unsplash.com/photo-1594432250843-b173fcfcf89a?q=80&w=1000&auto=format&fit=crop'} 
                      alt={product.name} 
                      fill 
                      sizes="48px" 
                      className="object-cover opacity-60" 
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase">{product.name}</p>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">{product.category}</p>
                  </div>
                </div>
                <p className="text-[10px] font-black tracking-widest">₱{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-prata">Active Logistics</h2>
          <div className="space-y-4">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="p-6 bg-zinc-900/30 border border-zinc-900 rounded-sm">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-bold tracking-widest uppercase">#{order.id.slice(0, 8)}</p>
                  <span className="text-[8px] font-black tracking-widest uppercase px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest">{order.shipping_address.fullName}</p>
                  </div>
                  <p className="text-[10px] font-black tracking-widest text-[#FF3B30]">₱{order.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-900 p-8 rounded-sm space-y-4 group hover:border-zinc-700 transition-all duration-700">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">{label}</span>
        {icon}
      </div>
      <p className="text-4xl font-prata tracking-tight text-white">{value}</p>
    </div>
  );
}
