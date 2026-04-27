'use client';

import { motion } from 'framer-motion';
import { Star, Pencil, Trash2, Package } from 'lucide-react';
import Image from 'next/image';

import { Product } from '../../admin/page';

interface ProductsTabProps {
  products: Product[];
  onToggleBestseller: (id: string, status: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductsTab({ products, onToggleBestseller, onEdit, onDelete }: ProductsTabProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-zinc-900/30 border border-zinc-900 rounded-sm overflow-hidden"
    >
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="p-8 text-[10px] font-black tracking-widest uppercase text-zinc-500">Fragrance</th>
              <th className="p-8 text-[10px] font-black tracking-widest uppercase text-zinc-500">Category</th>
              <th className="p-8 text-[10px] font-black tracking-widest uppercase text-zinc-500">Valuation</th>
              <th className="p-8 text-[10px] font-black tracking-widest uppercase text-zinc-500">Stock</th>
              <th className="p-8 text-[10px] font-black tracking-widest uppercase text-zinc-500">Status</th>
              <th className="p-8 text-[10px] font-black tracking-widest uppercase text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-zinc-900 group hover:bg-zinc-900/20 transition-all duration-500">
                <td className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-16 relative bg-zinc-800 rounded-sm overflow-hidden">
                      <Image 
                        src={product.image?.[0] || 'https://images.unsplash.com/photo-1594432250843-b173fcfcf89a?q=80&w=1000&auto=format&fit=crop'} 
                        alt={product.name} 
                        fill 
                        sizes="48px" 
                        className="object-cover opacity-80" 
                      />
                    </div>
                    <span className="text-[11px] font-black tracking-widest uppercase">{product.name}</span>
                  </div>
                </td>
                <td className="p-8 text-[10px] font-bold tracking-widest uppercase text-zinc-400">{product.category}</td>
                <td className="p-8 text-[10px] font-black tracking-widest uppercase">₱{product.price.toLocaleString()}</td>
                <td className="p-8">
                  <div className="flex items-center gap-3">
                    <Package size={14} className={product.stock_quantity < 5 ? 'text-[#FF3B30]' : 'text-zinc-600'} />
                    <span className={`text-[10px] font-black tracking-widest uppercase ${product.stock_quantity < 5 ? 'text-[#FF3B30]' : ''}`}>
                      {product.stock_quantity} UNITS
                    </span>
                  </div>
                </td>
                <td className="p-8">
                  <button 
                    onClick={() => onToggleBestseller(product.id, product.bestseller)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${
                      product.bestseller 
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100' 
                      : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500'
                    }`}
                  >
                    <Star size={12} fill={product.bestseller ? "currentColor" : "none"} />
                    <span className="text-[8px] font-black tracking-widest uppercase">
                      {product.bestseller ? 'BESTSELLER' : 'PROMPT'}
                    </span>
                  </button>
                </td>
                <td className="p-8 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button onClick={() => onEdit(product)} className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-all">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="p-3 text-zinc-500 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-sm transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
