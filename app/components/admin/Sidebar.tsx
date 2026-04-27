'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, LogOut, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeTab: 'dashboard' | 'products' | 'orders';
  setActiveTab: (tab: 'dashboard' | 'products' | 'orders') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const router = useRouter();

  const handleTabClick = (tab: 'dashboard' | 'products' | 'orders') => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-100 lg:hidden'
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className='hidden lg:flex w-64 border-r border-zinc-900 flex-col p-8 space-y-12'>
        <Logo />
        <nav className='flex-1 space-y-2'>
          <SidebarLink
            icon={<LayoutDashboard size={18} />}
            label='Dashboard'
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarLink
            icon={<Package size={18} />}
            label='Products'
            active={activeTab === 'products'}
            onClick={() => setActiveTab('products')}
          />
          <SidebarLink
            icon={<ShoppingBag size={18} />}
            label='Orders'
            active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
          />
        </nav>
        <ExitButton onExit={() => router.push('/')} />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='fixed top-0 left-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col p-8 space-y-12 z-101 lg:hidden'>
            <div className='flex items-center justify-between px-2'>
              <Logo />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className='p-2 text-zinc-500 hover:text-white'>
                <X size={20} />
              </button>
            </div>
            <nav className='flex-1 space-y-2'>
              <SidebarLink
                icon={<LayoutDashboard size={18} />}
                label='Dashboard'
                active={activeTab === 'dashboard'}
                onClick={() => handleTabClick('dashboard')}
              />
              <SidebarLink
                icon={<Package size={18} />}
                label='Products'
                active={activeTab === 'products'}
                onClick={() => handleTabClick('products')}
              />
              <SidebarLink
                icon={<ShoppingBag size={18} />}
                label='Orders'
                active={activeTab === 'orders'}
                onClick={() => handleTabClick('orders')}
              />
            </nav>
            <ExitButton onExit={() => router.push('/')} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Logo() {
  return (
    <div className='flex items-center gap-4 px-2'>
      <div className='w-8 h-8 bg-[#FF3B30] rounded-sm flex items-center justify-center'>
        <span className='text-[10px] font-black tracking-widest text-white'>
          SLG
        </span>
      </div>
      <span className='text-[10px] font-black tracking-[0.4em] uppercase text-white'>
        Admin Panel
      </span>
    </div>
  );
}

function SidebarLink({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-sm transition-all duration-500 ${
        active
          ? 'bg-zinc-900 text-white'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
      }`}>
      <span className={active ? 'text-[#FF3B30]' : ''}>{icon}</span>
      <span className='text-[10px] font-bold tracking-[0.2em] uppercase'>
        {label}
      </span>
      {active && (
        <motion.div
          layoutId='active-nav'
          className='ml-auto w-1 h-4 bg-[#FF3B30] rounded-full'
        />
      )}
    </button>
  );
}

function ExitButton({ onExit }: { onExit: () => void }) {
  return (
    <div className='pt-8 border-t border-zinc-900'>
      <button
        onClick={onExit}
        className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white transition-colors w-full group'>
        <LogOut
          size={18}
          className='group-hover:-translate-x-1 transition-transform'
        />
        <span className='text-[10px] font-bold tracking-widest uppercase'>
          Exit Control
        </span>
      </button>
    </div>
  );
}
