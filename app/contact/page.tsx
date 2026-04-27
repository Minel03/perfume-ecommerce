'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Mail, MessageSquare, User, Send, MapPin, Phone } from 'lucide-react';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert([{
          full_name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success('MESSAGE SENT TO CONCIERGE');
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('COMMUNICATION ERROR. PLEASE TRY AGAIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-48 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          
          {/* Left Side: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-16"
          >
            <div className="space-y-6">
              <span className="text-[10px] text-[#FF3B30] font-black tracking-[0.8em] uppercase block mb-6">
                GET IN TOUCH
              </span>
              <h1 className="text-6xl md:text-8xl font-prata text-zinc-900 tracking-tighter leading-none">
                Connect
              </h1>
              <p className="text-[11px] text-zinc-500 uppercase tracking-[0.2em] leading-relaxed max-w-md">
                Whether you&apos;re seeking a bespoke scent consultation or have a query about your manifest, our concierge is here to assist.
              </p>
            </div>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-zinc-50 flex items-center justify-center rounded-full border border-zinc-100">
                  <MapPin size={18} className="text-zinc-900" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2">The Atelier</p>
                  <p className="text-[11px] text-zinc-500 font-outfit uppercase">123 Fragrance Lane, Sillage District<br/>Manila, Philippines</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-zinc-50 flex items-center justify-center rounded-full border border-zinc-100">
                  <Phone size={18} className="text-zinc-900" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2">Voice</p>
                  <p className="text-[11px] text-zinc-500 font-outfit uppercase">+63 (917) 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-zinc-50 flex items-center justify-center rounded-full border border-zinc-100">
                  <Mail size={18} className="text-zinc-900" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2">Digital</p>
                  <p className="text-[11px] text-zinc-500 font-outfit uppercase">concierge@sillagelab.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: The Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-50 p-12 md:p-20 border border-zinc-100 rounded-sm"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-[0.4em] uppercase text-zinc-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                  <input 
                    {...register('name', { required: true })}
                    placeholder="ALEXANDER VOGUE"
                    className="w-full bg-transparent border-b border-zinc-200 py-4 pl-8 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30] transition-colors placeholder:text-zinc-200"
                  />
                </div>
                {errors.name && <p className="text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest mt-1">Required</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-[0.4em] uppercase text-zinc-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                  <input 
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    placeholder="ALEX@STYLISH.COM"
                    className="w-full bg-transparent border-b border-zinc-200 py-4 pl-8 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30] transition-colors placeholder:text-zinc-200"
                  />
                </div>
                {errors.email && <p className="text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest mt-1">Valid Email Required</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-[0.4em] uppercase text-zinc-400">Subject</label>
                <div className="relative">
                  <MessageSquare className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                  <select 
                    {...register('subject', { required: true })}
                    className="w-full bg-transparent border-b border-zinc-200 py-4 pl-8 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30] transition-colors appearance-none"
                  >
                    <option value="">Select Inquery Type</option>
                    <option value="General Support">General Support</option>
                    <option value="Bespoke Scent Consultation">Bespoke Scent Consultation</option>
                    <option value="Wholesale & Partnerships">Wholesale & Partnerships</option>
                    <option value="Order Tracking">Order Tracking Manifest</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-bold tracking-[0.4em] uppercase text-zinc-400">Message</label>
                <textarea 
                  {...register('message', { required: true })}
                  placeholder="HOW CAN OUR CONCIERGE ASSIST YOU?"
                  rows={4}
                  className="w-full bg-zinc-100/50 border border-zinc-200 p-8 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-[#FF3B30] transition-colors placeholder:text-zinc-300 rounded-sm"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zinc-900 text-white py-6 text-[10px] font-black tracking-[0.6em] uppercase hover:bg-[#FF3B30] transition-all duration-500 rounded-sm flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isSubmitting ? 'SENDING...' : (
                  <>
                    <Send size={14} />
                    Submit Manifest
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
