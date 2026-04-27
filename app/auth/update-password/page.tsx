'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/useAuthStore';

const updateSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UpdateFormData = z.infer<typeof updateSchema>;

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false);
  const { user, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If not initialized yet, wait
    if (!initialized) return;

    // If no user/session is found, redirect to login
    // Note: Supabase automatically handles the recovery session when following the email link
    if (!user) {
      toast.error('SESSION EXPIRED. PLEASE REQUEST A NEW LINK.');
      router.push('/login');
    }
  }, [user, initialized, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
  });

  const onSubmit = async (data: UpdateFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: data.password 
      });
      if (error) throw error;
      
      toast.success('PASSWORD UPDATED SUCCESSFULLY');
      router.push('/');
    } catch (err: unknown) {
      const error = err as { message: string };
      toast.error(error.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#FF3B30]" size={32} />
        <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400">Verifying Concierge...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-50/30 rounded-full blur-3xl -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0.8em' }}
            className="text-[10px] text-[#FF3B30] font-black uppercase mb-6 block tracking-[0.8em] ml-[0.8em]"
          >
            SECURITY RESTORATION
          </motion.span>
          <h1 className="text-5xl font-prata text-zinc-900 tracking-tight">
            New Identity
          </h1>
          <p className="text-[10px] text-zinc-400 tracking-[0.2em] uppercase mt-4">
            Secure your access with a new password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} strokeWidth={1.5} />
              <input 
                {...register('password')}
                type="password" 
                placeholder="New Password" 
                className="w-full bg-zinc-50 border border-zinc-100 rounded-sm py-5 pl-12 pr-6 text-[11px] font-outfit tracking-widest outline-none focus:border-zinc-900 transition-colors uppercase"
              />
              {errors.password && (
                <p className="text-[8px] text-[#FF3B30] mt-1 tracking-widest uppercase font-bold">{errors.password.message}</p>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} strokeWidth={1.5} />
              <input 
                {...register('confirmPassword')}
                type="password" 
                placeholder="Confirm New Password" 
                className="w-full bg-zinc-50 border border-zinc-100 rounded-sm py-5 pl-12 pr-6 text-[11px] font-outfit tracking-widest outline-none focus:border-zinc-900 transition-colors uppercase"
              />
              {errors.confirmPassword && (
                <p className="text-[8px] text-[#FF3B30] mt-1 tracking-widest uppercase font-bold">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="group relative w-full bg-zinc-900 text-white py-6 overflow-hidden rounded-sm transition-all duration-500 disabled:opacity-50"
          >
            <span className="relative z-10 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center justify-center gap-3">
              {loading ? 'SECURING...' : 'UPDATE PASSWORD'}
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
