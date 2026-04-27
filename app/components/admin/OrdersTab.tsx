'use client';

import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Image from 'next/image';

import { Order, OrderItem } from '../../admin/page';

interface OrdersTabProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

export default function OrdersTab({ orders, onUpdateStatus }: OrdersTabProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {orders.map((order) => (
        <div key={order.id} className="bg-zinc-900/30 border border-zinc-900 p-8 rounded-sm group hover:border-zinc-700 transition-all duration-700">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <p className="text-[11px] font-black tracking-widest uppercase text-zinc-400">#{order.id.slice(0, 8)}</p>
              <div className={`px-4 py-1.5 rounded-full text-[8px] font-black tracking-widest uppercase ${
                order.status === 'Paid' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 
                order.status === 'Delivered' ? 'bg-zinc-100 text-zinc-950' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                {order.status}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-12 items-start">
              <div className="lg:col-span-2">
                <p className="text-[8px] text-zinc-500 tracking-widest uppercase mb-2">Customer</p>
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{order.shipping_address.fullName}</p>
                <p className="text-[8px] text-zinc-600 tracking-widest uppercase mt-1">{order.shipping_address.phone}</p>
              </div>
              
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-[8px] text-zinc-500 tracking-widest uppercase mb-2">Manifest Items</p>
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item: OrderItem, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 pr-3 rounded-sm">
                      <div className="w-6 h-8 relative bg-zinc-800">
                        <Image 
                          src={item.image?.[0] || 'https://images.unsplash.com/photo-1594432250843-b173fcfcf89a?q=80&w=1000&auto=format&fit=crop'} 
                          alt={item.name} 
                          fill 
                          sizes="24px" 
                          className="object-cover opacity-60" 
                        />
                      </div>
                      <p className="text-[8px] font-bold tracking-widest uppercase">
                        <span className="text-[#FF3B30]">{item.quantity} ×</span> {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <p className="text-[8px] text-zinc-500 tracking-widest uppercase mb-2">Valuation</p>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#FF3B30]">₱{order.total.toLocaleString()}</p>
              </div>

              <div className="lg:col-span-2">
                <p className="text-[8px] text-zinc-500 tracking-widest uppercase mb-2">Method</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{order.payment_method}</p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 space-y-4">
                <div>
                  <p className="text-[8px] text-zinc-500 tracking-wider uppercase mb-2">Fulfillment Status</p>
                  <select 
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    value={order.status}
                    className="w-full bg-zinc-950 border border-zinc-800 text-[9px] font-black tracking-widest uppercase p-3 rounded-sm outline-none focus:border-zinc-600 transition-all cursor-pointer"
                  >
                    <option value="Pending Payment">Pending Payment</option>
                    <option value="Paid">Paid</option>
                    <option value="Awaiting COD">Awaiting COD</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <p className="text-[8px] text-zinc-500 tracking-wider uppercase mb-2">Logistics Intel</p>
                  <input 
                    placeholder="Add internal note..."
                    defaultValue={order.logistics_intel}
                    onBlur={async (e) => {
                      const val = e.target.value;
                      const { error } = await supabase
                        .from('orders')
                        .update({ logistics_intel: val })
                        .eq('id', order.id);
                      if (!error) toast.success('LOGISTICS UPDATED');
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 text-[9px] font-bold tracking-widest uppercase p-3 rounded-sm outline-none focus:border-zinc-600 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
