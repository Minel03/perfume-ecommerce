'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Menu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

// New Modular Components
import AdminSidebar from '@/app/components/admin/Sidebar';
import DashboardTab from '@/app/components/admin/DashboardTab';
import ProductsTab from '@/app/components/admin/ProductsTab';
import OrdersTab from '@/app/components/admin/OrdersTab';

type Tab = 'dashboard' | 'products' | 'orders';

export interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  image: string[];
  description: string;
  category: string;
  stock_quantity: number;
  bestseller: boolean;
  notes?: { top: string; heart: string; base: string };
}

export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string[];
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_method: string;
  payment_success: boolean;
  items: OrderItem[];
  shipping_address: {
    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  created_at: string;
  logistics_intel?: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form & Upload State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'unisex',
    stock_quantity: '10',
    bestseller: false,
    notes: { top: '', heart: '', base: '' },
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [prodRes, orderRes] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }),
    ]);
    if (prodRes.data) setProducts(prodRes.data as Product[]);
    if (orderRes.data) setOrders(orderRes.data as Order[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const initFetch = async () => {
        await fetchData();
      };
      initFetch();
    }
  }, [user, fetchData]);

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
  ) => {
    const { data: order } = await supabase
      .from('orders')
      .select('status, items, payment_success')
      .eq('id', orderId)
      .single();
    if (!order) return;

    const isNewConfirmed = ['Paid', 'Processing', 'Shipped'].includes(
      newStatus,
    );
    const wasConfirmed =
      ['Paid', 'Processing', 'Shipped', 'Delivered'].includes(order.status) ||
      order.payment_success;

    const { error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_success: newStatus === 'Paid' ? true : order.payment_success,
      })
      .eq('id', orderId);

    if (!error) {
      setOrders((current) =>
        current.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: newStatus,
                payment_success:
                  newStatus === 'Paid' ? true : o.payment_success,
              }
            : o,
        ),
      );
      if (isNewConfirmed && !wasConfirmed && order.items) {
        for (const item of order.items) {
          const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item._id)
            .single();
          if (product)
            await supabase
              .from('products')
              .update({
                stock_quantity: Math.max(
                  0,
                  product.stock_quantity - item.quantity,
                ),
              })
              .eq('id', item._id);
        }
        toast.success(`MANIFEST FULFILLED & STOCK UPDATED`);
      } else {
        toast.success(`STATUS UPDATED TO ${newStatus.toUpperCase()}`);
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock_quantity: product.stock_quantity.toString(),
      bestseller: product.bestseller,
      notes: product.notes || { top: '', heart: '', base: '' },
    });
    setIsEditing(true);
    setIsAddingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const filePath = `products/${Math.random()}.${file.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);
          if (uploadError) throw uploadError;
          const {
            data: { publicUrl },
          } = supabase.storage.from('product-images').getPublicUrl(filePath);
          imageUrls.push(publicUrl);
        }
      }

      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price) || 0,
        description: newProduct.description,
        category: newProduct.category,
        stock_quantity: parseInt(newProduct.stock_quantity) || 0,
        bestseller: newProduct.bestseller,
        notes: newProduct.notes,
        image: imageUrls.length > 0 ? imageUrls : undefined,
      };

      if (isEditing && editingProductId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProductId);
        if (error) throw error;
        toast.success('MANIFEST UPDATED');
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast.success('NEW FRAGRANCE PUBLISHED');
      }

      setIsAddingProduct(false);
      setIsEditing(false);
      fetchData();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(`ERROR: ${error.message || 'FAILED TO SAVE'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('PERMANENTLY REMOVE FROM ARCHIVE?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      toast.success('PRODUCT REMOVED');
      fetchData();
    }
  };

  const handleToggleBestseller = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ bestseller: !currentStatus })
      .eq('id', id);
    if (!error) {
      toast.success(
        !currentStatus ? 'PROMOTED TO BESTSELLER' : 'REMOVED FROM BESTSELLERS',
      );
      fetchData();
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className='min-h-screen bg-zinc-950 flex overflow-x-hidden'>
        {/* Sidebar Skeleton */}
        <div className="w-80 border-r border-zinc-900 p-12 space-y-12 hidden lg:block">
          <Skeleton className="h-12 w-32 bg-zinc-900" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-full bg-zinc-900" />
            <Skeleton className="h-4 w-full bg-zinc-900" />
            <Skeleton className="h-4 w-full bg-zinc-900" />
          </div>
        </div>
        <div className='flex-1 p-6 md:p-12 space-y-16'>
          <div className="flex justify-between items-center">
            <div className="space-y-4">
              <Skeleton className="h-3 w-24 bg-zinc-900" />
              <Skeleton className="h-12 w-48 bg-zinc-900" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 bg-zinc-900 rounded-full" />
              <Skeleton className="h-12 w-32 bg-zinc-900 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-48 w-full bg-zinc-900" />
            <Skeleton className="h-48 w-full bg-zinc-900" />
            <Skeleton className="h-48 w-full bg-zinc-900" />
          </div>
          <Skeleton className="h-96 w-full bg-zinc-900" />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100 flex overflow-x-hidden'>
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className='flex-1 min-w-0 overflow-y-auto max-h-screen custom-scrollbar relative'>
        <div className='lg:hidden sticky top-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 p-6 flex justify-between items-center z-50'>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='p-2 -ml-2 text-zinc-100'>
            <Menu size={24} />
          </button>
          <span className='text-[10px] font-black tracking-[0.4em] uppercase text-zinc-500'>
            {activeTab}
          </span>
          <div className='w-10' />
        </div>

        <div className='p-6 md:p-12'>
          <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16'>
            <div>
              <p className='text-[10px] text-[#FF3B30] font-black tracking-[0.5em] uppercase mb-2'>
                Master Suite
              </p>
              <h1 className='text-4xl font-prata tracking-tight capitalize'>
                {activeTab}
              </h1>
            </div>
            <div className='flex flex-wrap gap-4 w-full md:w-auto'>
              <button
                onClick={fetchData}
                className='flex-1 md:flex-none bg-zinc-900 border border-zinc-800 text-zinc-400 px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:text-white transition-all'>
                Sync Data
              </button>
              {activeTab === 'products' && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setIsAddingProduct(true);
                    setNewProduct({
                      name: '',
                      price: '',
                      description: '',
                      category: 'unisex',
                      stock_quantity: '10',
                      bestseller: false,
                      notes: { top: '', heart: '', base: '' },
                    });
                  }}
                  className='flex-1 md:flex-none bg-zinc-100 text-zinc-950 px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#FF3B30] hover:text-white transition-all'>
                  <Plus size={16} /> Add Fragrance
                </button>
              )}
            </div>
          </header>

          <AnimatePresence mode='wait'>
            {activeTab === 'dashboard' && (
              <DashboardTab
                key='dash'
                products={products}
                orders={orders}
              />
            )}
            {activeTab === 'products' && (
              <ProductsTab
                key='prods'
                products={products}
                onToggleBestseller={handleToggleBestseller}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersTab
                key='ords'
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Product Modal (keeping simple for now) */}
      <AnimatePresence>
        {isAddingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-200 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto'>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className='bg-zinc-900 w-full max-w-2xl p-6 md:p-12 rounded-sm border border-zinc-800 my-auto'>
              <h2 className='text-3xl font-prata mb-8'>
                {isEditing ? 'Edit Fragrance' : 'Add to Collection'}
              </h2>
              <form
                onSubmit={handleSaveProduct}
                className='grid grid-cols-2 gap-4 md:gap-8'>
                <div className='space-y-2 col-span-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Fragrance Name
                  </label>
                  <input
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30]'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Price (PHP)
                  </label>
                  <input
                    required
                    type='number'
                    min='0'
                    step='0.01'
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30]'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Stock Units
                  </label>
                  <input
                    required
                    type='number'
                    min='0'
                    value={newProduct.stock_quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock_quantity: e.target.value,
                      })
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30]'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30]'>
                    <option value='unisex'>Unisex</option>
                    <option value='men'>Men</option>
                    <option value='women'>Women</option>
                  </select>
                </div>
                <div className='space-y-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Top Note
                  </label>
                  <input
                    value={newProduct.notes.top}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        notes: { ...newProduct.notes, top: e.target.value },
                      })
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30]'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Heart Note
                  </label>
                  <input
                    value={newProduct.notes.heart}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        notes: { ...newProduct.notes, heart: e.target.value },
                      })
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30]'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Base Note
                  </label>
                  <input
                    value={newProduct.notes.base}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        notes: { ...newProduct.notes, base: e.target.value },
                      })
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30]'
                  />
                </div>
                <div className='space-y-2 col-span-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Gallery (Optional)
                  </label>
                  <input
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={(e) =>
                      setSelectedFiles(Array.from(e.target.files || []))
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[10px] font-bold tracking-widest uppercase outline-none'
                  />
                </div>
                <div className='space-y-2 col-span-2'>
                  <label className='text-[8px] font-bold tracking-widest uppercase text-zinc-500'>
                    Description
                  </label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className='w-full bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30] min-h-[100px]'
                  />
                </div>
                <div className='col-span-2 flex gap-4 pt-4'>
                  <button
                    type='submit'
                    disabled={uploading}
                    className='flex-1 bg-white text-zinc-950 py-5 text-[10px] font-black tracking-widest uppercase hover:bg-[#FF3B30] hover:text-white transition-all disabled:opacity-50'>
                    {uploading ? 'SAVING...' : 'Save Fragrance'}
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setIsAddingProduct(false);
                      setIsEditing(false);
                    }}
                    className='px-8 text-[10px] font-black tracking-widest uppercase text-zinc-500'>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
