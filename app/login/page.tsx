'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/useAuthStore';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (initialized && user) {
      router.push('/');
    }
  }, [user, initialized, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    const { email, password } = data;

    try {
      if (isRecovery) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });
        if (error) throw error;
        toast.success('RECOVERY LINK SENT');
        setIsRecovery(false);
        setIsLogin(true);
      } else if (isLogin) {
        if (!password) {
          toast.error('PASSWORD REQUIRED');
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('WELCOME BACK');
      } else {
        if (!password) {
          toast.error('PASSWORD REQUIRED');
          return;
        }
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });
        if (error) throw error;
        toast.success('VERIFICATION EMAIL SENT');
      }
      router.push('/');
    } catch (err: unknown) {
      const error = err as { message: string };
      toast.error(error.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  if (!initialized || user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#FF3B30]" size={32} />
        <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400">Verifying Identity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-32 relative overflow-hidden">
      {/* Background Detail */}
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
            {isRecovery ? 'RECOVER ACCESS' : isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </motion.span>
          <h1 className="text-5xl font-prata text-zinc-900 tracking-tight">
            {isRecovery ? 'Restoration' : isLogin ? 'The Sillage Lab' : 'Join the House'}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} strokeWidth={1.5} />
              <input 
                {...register('email')}
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-zinc-50 border border-zinc-100 rounded-sm py-5 pl-12 pr-6 text-[11px] font-outfit tracking-widest outline-none focus:border-zinc-900 transition-colors uppercase"
              />
              {errors.email && (
                <p className="text-[8px] text-[#FF3B30] mt-1 tracking-widest uppercase font-bold">{errors.email.message}</p>
              )}
            </div>
            {!isRecovery && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} strokeWidth={1.5} />
                <input 
                  {...register('password')}
                  type="password" 
                  placeholder="Password" 
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-sm py-5 pl-12 pr-6 text-[11px] font-outfit tracking-widest outline-none focus:border-zinc-900 transition-colors uppercase"
                />
                {errors.password && (
                  <p className="text-[8px] text-[#FF3B30] mt-1 tracking-widest uppercase font-bold">{errors.password.message}</p>
                )}
                <button 
                  type="button"
                  onClick={() => setIsRecovery(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black tracking-widest text-zinc-400 hover:text-[#FF3B30] transition-colors uppercase"
                >
                  Forgot?
                </button>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="group relative w-full bg-zinc-900 text-white py-6 overflow-hidden rounded-sm transition-all duration-500 disabled:opacity-50"
          >
            <span className="relative z-10 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center justify-center gap-3">
              {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'REGISTER'}
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />}
            </span>
          </button>
        </form>

        <div className="mt-12 text-center flex flex-col gap-4">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setIsRecovery(false);
            }}
            className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 hover:text-zinc-900 transition-colors uppercase"
          >
            {isRecovery ? "Back to Login" : isLogin ? "Don't have an account? Join us" : "Already a member? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

