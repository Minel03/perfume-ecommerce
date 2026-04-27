'use client';

import { useAuthStore } from '@/lib/store/useAuthStore';
import { motion } from 'framer-motion';
import { User, Shield, Calendar, LogOut, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuthStore();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const [preferences, setPreferences] = useState({
    mailing_list: user?.user_metadata?.preferences?.mailing_list ?? true,
    order_notifications: user?.user_metadata?.preferences?.order_notifications ?? true,
    exclusive_access: user?.user_metadata?.preferences?.exclusive_access ?? true
  });

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setRecentOrders(data as Order[]);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      const initFetch = async () => {
        await fetchOrders();
      };
      initFetch();
    }
  }, [user, loading, router, fetchOrders]);

  const handleTogglePreference = async (key: string) => {
    const newPrefs = { ...preferences, [key]: !preferences[key as keyof typeof preferences] };
    setPreferences(newPrefs);
    
    const { error } = await supabase.auth.updateUser({
      data: { preferences: newPrefs }
    });

    if (!error) {
      toast.success('PREFERENCES SYNCHRONIZED');
    }
  };

  if (loading || !user) return null;

  const profile = user?.user_metadata?.scent_profile;

  return (
    <div className="min-h-screen bg-white py-32 md:py-48 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* LEFT COLUMN: Identity */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-20"
          >
            <div className="space-y-12">
              <div>
                <span className="text-[10px] text-[#FF3B30] font-black tracking-[0.8em] uppercase block mb-6">
                  ACCOUNT OVERVIEW
                </span>
                <h1 className="text-6xl md:text-8xl font-prata text-zinc-900 tracking-tighter leading-none">
                  Identity
                </h1>
              </div>

              {/* Signature DNA Card */}
              {profile && (
                <div className="relative overflow-hidden bg-zinc-950 p-12 rounded-sm text-white group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3B30]/20 blur-[100px] rounded-full -mr-32 -mt-32" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles size={16} className="text-[#FF3B30]" />
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400">Your Olfactory DNA</span>
                      </div>
                      <h3 className="text-4xl font-prata mb-2 capitalize">{profile.vibe} & {profile.category}</h3>
                      <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Preferred Intensity: {profile.intensity}</p>
                    </div>
                    <button 
                      onClick={() => router.push('/quiz')}
                      className="px-8 py-4 border border-zinc-800 rounded-full text-[9px] font-bold tracking-widest uppercase hover:bg-white hover:text-zinc-950 transition-all duration-500"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="flex items-center gap-6 p-8 bg-zinc-50 border border-zinc-100 rounded-sm">
                  <div className="w-16 h-16 bg-white border border-zinc-200 rounded-full flex items-center justify-center">
                    <User size={24} className="text-zinc-900" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-400 tracking-[0.3em] uppercase mb-1">Authenticated Email</p>
                    <p className="text-[11px] font-bold tracking-widest text-zinc-900 uppercase">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 border border-zinc-100 rounded-sm">
                    <Shield size={18} className="text-zinc-400 mb-4" strokeWidth={1} />
                    <p className="text-[8px] text-zinc-400 tracking-[0.3em] uppercase mb-1">Status</p>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-900 uppercase">Verified Member</p>
                  </div>
                  <div className="p-8 border border-zinc-100 rounded-sm">
                    <Calendar size={18} className="text-zinc-400 mb-4" strokeWidth={1} />
                    <p className="text-[8px] text-zinc-400 tracking-[0.3em] uppercase mb-1">Member Since</p>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-900 uppercase">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Archives Section */}
            <div className="space-y-12">
              <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
                <h2 className="text-4xl font-prata text-zinc-900 tracking-tight">Archives</h2>
                <span className="text-[9px] font-bold text-zinc-400 tracking-widest uppercase">Order History</span>
              </div>
              
              <div className="space-y-6">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-zinc-50 border border-zinc-100 rounded-sm group hover:border-zinc-300 transition-all">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-widest uppercase">#{order.id.slice(0, 8)}</p>
                      <p className="text-[9px] text-zinc-400 uppercase tracking-widest">
                        {new Date(order.created_at).toLocaleDateString()} — {order.status}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-8">
                      <p className="text-[11px] font-black tracking-widest">₱{order.total.toLocaleString()}</p>
                      <button className="flex items-center gap-3 text-[9px] font-bold tracking-widest uppercase text-[#FF3B30] group-hover:translate-x-1 transition-all">
                        Track Manifest <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-sm">
                    <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">No Manifests in Archive</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Concierge */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-12"
          >
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-900 pb-4 border-b border-zinc-100">
                Preferences
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'mailing_list', label: 'Mailing List' },
                  { id: 'order_notifications', label: 'Order Notifications' },
                  { id: 'exclusive_access', label: 'Exclusive Access' }
                ].map(pref => (
                  <button 
                    key={pref.id} 
                    onClick={() => handleTogglePreference(pref.id)}
                    className="flex justify-between items-center py-2 w-full group cursor-pointer"
                  >
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 transition-colors">{pref.label}</span>
                    <div className="w-8 h-4 bg-zinc-100 rounded-full relative p-0.5 border border-zinc-200">
                      <motion.div 
                        animate={{ x: preferences[pref.id as keyof typeof preferences] ? 16 : 0 }}
                        className={`w-3 h-3 rounded-full ${preferences[pref.id as keyof typeof preferences] ? 'bg-[#FF3B30]' : 'bg-zinc-300'}`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-zinc-900 text-white rounded-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B30]/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 space-y-6">
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase">Need Assistance?</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-outfit">
                  Our concierge is available 24/7 to assist with your olfactory journey.
                </p>
                <a 
                  href="mailto:support@sillagelab.com?subject=Bespoke Concierge Request"
                  className="inline-block text-[9px] font-bold tracking-[0.2em] border-b border-white/20 pb-1 hover:border-white transition-all uppercase"
                >
                  Contact Concierge
                </a>
              </div>
            </div>

            <button 
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
              className="group flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase text-[#FF3B30] hover:translate-x-2 transition-all duration-500"
            >
              <LogOut size={16} />
              Sign out from account
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
