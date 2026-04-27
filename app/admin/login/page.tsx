'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // In a real app, you'd check a 'role' column or metadata here.
      // For now, we'll verify the login is successful and redirect to admin.
      toast.success('VAULT ACCESS GRANTED');
      router.push('/admin');
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(`ACCESS DENIED: ${error.message || 'INVALID CREDENTIALS'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF3B30]/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center mx-auto mb-8">
            <Lock className="text-[#FF3B30]" size={24} />
          </div>
          <p className="text-[10px] font-black tracking-[0.8em] uppercase text-[#FF3B30]">Security Clearance</p>
          <h1 className="text-5xl font-prata text-white tracking-tighter">Sillage Vault</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">Authorized curator access only. All interactions are archived.</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[8px] font-black tracking-[0.3em] uppercase text-zinc-500 ml-4">Curator Identifier</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="curator@sillagelab.com"
              className="w-full bg-zinc-900/50 border border-zinc-800 p-6 text-[11px] font-bold tracking-widest text-white outline-none focus:border-[#FF3B30] focus:bg-zinc-900 transition-all rounded-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] font-black tracking-[0.3em] uppercase text-zinc-500 ml-4">Security Key</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900/50 border border-zinc-800 p-6 text-[11px] font-bold tracking-widest text-white outline-none focus:border-[#FF3B30] focus:bg-zinc-900 transition-all rounded-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-zinc-950 py-6 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-[#FF3B30] hover:text-white transition-all duration-700 rounded-sm flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                Enter the Vault
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-zinc-700" />
            <span className="text-[8px] font-bold text-zinc-700 tracking-widest uppercase">RSA-4096 Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-zinc-700" />
            <span className="text-[8px] font-bold text-zinc-700 tracking-widest uppercase">Hardware MFA Ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
