'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Package,
} from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  address: z.string().min(10, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  postalCode: z
    .string()
    .regex(/^\d+$/, 'Zip code must contain only numbers')
    .min(4, 'Minimum 4 digits'),
  country: z.string().min(2, 'Country is required'),
  phone: z
    .string()
    .regex(/^\d+$/, 'Phone must contain only numbers')
    .min(10, 'Minimum 10 digits'),
  notes: z.string(),
  saveAddress: z.boolean(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying] = useState(false);
  const [verificationStatus] = useState<'processing' | 'success'>('processing');

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      saveAddress: false,
      notes: '',
    },
  });

  // Auto-fill email and saved address when user is loaded
  useEffect(() => {
    if (user) {
      const savedAddress = user.user_metadata?.saved_address;
      if (savedAddress) {
        reset({
          ...getValues(),
          email: user.email || '',
          fullName: savedAddress.fullName || '',
          phone: savedAddress.phone || '',
          address: savedAddress.address || '',
          city: savedAddress.city || '',
          state: savedAddress.state || '',
          postalCode: savedAddress.postalCode || '',
          country: savedAddress.country || '',
        });
      } else if (user.email) {
        reset({ 
          ...getValues(),
          email: user.email 
        });
      }
    }
  }, [user, reset, getValues]);

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const [paymentMethod, setPaymentMethod] = useState<'paymongo' | 'cod'>(
    'paymongo',
  );

  const onHandlePayment = async () => {
    if (!user) return;

    setIsProcessing(true);

    const subtotal = getTotal();
    const shipping = subtotal >= 3000 ? 0 : 150;
    const tax = subtotal * 0.12;
    const grandTotal = subtotal + shipping + tax;
    const formData = getValues();

    // 2. Prepare Order Record
    const orderData = {
      id: paymentMethod === 'paymongo' ? crypto.randomUUID() : undefined,
      user_id: user.id,
      items: items,
      total: grandTotal,
      shipping_address: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      status: paymentMethod === 'paymongo' ? 'Pending Payment' : 'Processing',
      payment_method: paymentMethod === 'paymongo' ? 'PayMongo' : 'COD',
      payment_success: false,
      created_at: new Date().toISOString(),
      notes: formData.notes
    };

    if (paymentMethod === 'paymongo') {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            total: grandTotal,
            customerInfo: formData,
            orderId: orderData.id,
          }),
        });

        const data = await response.json();
        if (data.error) {
          toast.error(`PAYMONGO ERROR: ${data.error}`);
          setIsProcessing(false);
          return;
        }

        const { error: dbError } = await supabase.from('orders').insert(orderData);
        if (dbError) {
          toast.error('ORDER ARCHIVE FAILED.');
          setIsProcessing(false);
          return;
        }

        // 4. Save Address if requested
        if (formData.saveAddress) {
          await supabase.auth.updateUser({
            data: { saved_address: orderData.shipping_address }
          });
        }

        window.location.href = data.checkoutUrl;
        return;
    } catch {
      toast.error('CONNECTION ERROR.');
      setIsProcessing(false);
      return;
    }
    }

    // COD Logic
    const { error: dbError } = await supabase.from('orders').insert(orderData);
    if (dbError) {
      toast.error('ORDER ARCHIVE FAILED.');
      setIsProcessing(false);
      return;
    }

    if (formData.saveAddress) {
      await supabase.auth.updateUser({
        data: { saved_address: orderData.shipping_address }
      });
      toast.success('ADDRESS SAVED TO YOUR VAULT');
    }

    // 5. Update Inventory (Decrement Stock)
    try {
      for (const item of items) {
        // Use the correct ID field (item._id maps to the DB 'id')
        const productId = item._id;
        
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', productId)
          .single();
        
        if (product) {
          const newQuantity = Math.max(0, product.stock_quantity - item.quantity);
          await supabase
            .from('products')
            .update({ stock_quantity: newQuantity })
            .eq('id', productId);
        }
      }
    } catch (invError) {
      console.error('Inventory Sync Error:', invError);
      // We don't block the order if inventory sync fails, but we log it
    }

    toast.success('ORDER ARCHIVED SUCCESSFULLY');
    clearCart();
    // Wipe cloud-sync cart
    await supabase.from('carts').delete().eq('user_id', user.id);
    
    router.push('/order');
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center space-y-8 bg-white'>
        <Package
          size={64}
          className='text-zinc-100'
          strokeWidth={1}
        />
        <p className='text-[10px] font-bold tracking-[0.5em] uppercase text-zinc-400'>
          Your manifest is empty
        </p>
        <button
          onClick={() => router.push('/collection')}
          className='border-b border-zinc-900 pb-2 text-[10px] font-bold tracking-[0.4em] uppercase'>
          Return to Collection
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white py-32 md:py-48 px-6 relative'>
      {/* PayMongo Simulation Portal */}
      <AnimatePresence>
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6'>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className='bg-white w-full max-w-md overflow-hidden rounded-sm shadow-2xl'>
              <div className='bg-zinc-900 p-6 flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse' />
                  <span className='text-[10px] font-bold tracking-[0.3em] text-white uppercase'>
                    Secure Payment Portal
                  </span>
                </div>
                <ShieldCheck
                  size={16}
                  className='text-white/40'
                />
              </div>

              <div className='p-10 text-center space-y-8'>
                {verificationStatus === 'processing' ? (
                  <>
                    <div className='w-16 h-16 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin mx-auto' />
                    <div className='space-y-2'>
                      <h3 className='text-xl font-prata'>Verifying Payment</h3>
                      <p className='text-[10px] text-zinc-400 uppercase tracking-widest'>
                        Processing through PayMongo Secure API...
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className='w-16 h-16 bg-[#FF3B30] rounded-full flex items-center justify-center mx-auto'>
                      <ShieldCheck
                        size={32}
                        className='text-white'
                      />
                    </motion.div>
                    <div className='space-y-2'>
                      <h3 className='text-xl font-prata text-zinc-900'>
                        Success
                      </h3>
                      <p className='text-[10px] text-zinc-400 uppercase tracking-widest'>
                        Order PM-A87F2X Authorized
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='max-w-[1440px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-20'>
          {/* Main Checkout Flow */}
          <div className='lg:col-span-7 space-y-16'>
            <div className='flex items-center justify-between border-b border-zinc-100 pb-8'>
              <div className='flex gap-12'>
                <button
                  onClick={prevStep}
                  className={`text-[10px] font-black tracking-[0.4em] uppercase transition-colors ${step === 1 ? 'text-[#FF3B30]' : 'text-zinc-300'}`}>
                  01 SHIPPNG
                </button>
                <button
                  onClick={step === 2 ? () => {} : undefined}
                  className={`text-[10px] font-black tracking-[0.4em] uppercase transition-colors ${step === 2 ? 'text-[#FF3B30]' : 'text-zinc-300'}`}>
                  02 PAYMENT
                </button>
              </div>
            </div>

            <AnimatePresence mode='wait'>
              {step === 1 ? (
                <motion.div
                  key='shipping'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className='space-y-12'>
                  <h2 className='text-4xl md:text-6xl font-prata text-zinc-900 tracking-tight'>
                    Delivery Details
                  </h2>
                  <form className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                          Full Name
                        </label>
                        <input
                          {...register('fullName')}
                          className={`w-full bg-zinc-50 border p-5 text-[11px] font-bold tracking-widest outline-none transition-colors uppercase ${errors.fullName ? 'border-[#FF3B30]' : 'border-zinc-100 focus:border-zinc-900'}`}
                        />
                        {errors.fullName && (
                          <p className='text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest'>
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                          Email Address
                        </label>
                        <input
                          {...register('email')}
                          className={`w-full bg-zinc-50 border p-5 text-[11px] font-bold tracking-widest outline-none transition-colors uppercase ${errors.email ? 'border-[#FF3B30]' : 'border-zinc-100 focus:border-zinc-900'}`}
                        />
                        {errors.email && (
                          <p className='text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest'>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                        Phone Number
                      </label>
                      <input
                        {...register('phone')}
                        type='tel'
                        onInput={(e: React.FormEvent<HTMLInputElement>) =>
                          ((e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(
                            /[^0-9]/g,
                            '',
                          ))
                        }
                        placeholder='09XXXXXXXX'
                        className={`w-full bg-zinc-50 border p-5 text-[11px] font-bold tracking-widest outline-none transition-colors uppercase ${errors.phone ? 'border-[#FF3B30]' : 'border-zinc-100 focus:border-zinc-900'}`}
                      />
                      {errors.phone && (
                        <p className='text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest'>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                        Street Address
                      </label>
                      <input
                        {...register('address')}
                        className={`w-full bg-zinc-50 border p-5 text-[11px] font-bold tracking-widest outline-none transition-colors uppercase ${errors.address ? 'border-[#FF3B30]' : 'border-zinc-100 focus:border-zinc-900'}`}
                      />
                      {errors.address && (
                        <p className='text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest'>
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                          City
                        </label>
                        <input
                          {...register('city')}
                          className={`w-full bg-zinc-50 border p-5 text-[11px] font-bold tracking-widest outline-none transition-colors uppercase ${errors.city ? 'border-[#FF3B30]' : 'border-zinc-100 focus:border-zinc-900'}`}
                        />
                        {errors.city && (
                          <p className='text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest'>
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                          State / Province
                        </label>
                        <input
                          {...register('state')}
                          className={`w-full bg-zinc-50 border p-5 text-[11px] font-bold tracking-widest outline-none transition-colors uppercase ${errors.state ? 'border-[#FF3B30]' : 'border-zinc-100 focus:border-zinc-900'}`}
                        />
                        {errors.state && (
                          <p className='text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest'>
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                          Zip Code
                        </label>
                        <input
                          {...register('postalCode')}
                          onInput={(e: React.FormEvent<HTMLInputElement>) =>
                            ((e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(
                              /[^0-9]/g,
                              '',
                            ))
                          }
                          className={`w-full bg-zinc-50 border p-5 text-[11px] font-bold tracking-widest outline-none transition-colors uppercase ${errors.postalCode ? 'border-[#FF3B30]' : 'border-zinc-100 focus:border-zinc-900'}`}
                        />
                        {errors.postalCode && (
                          <p className='text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest'>
                            {errors.postalCode.message}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                          Country
                        </label>
                        <input
                          {...register('country')}
                          className={`w-full bg-zinc-50 border p-5 text-[11px] font-bold tracking-widest outline-none transition-colors uppercase ${errors.country ? 'border-[#FF3B30]' : 'border-zinc-100 focus:border-zinc-900'}`}
                        />
                        {errors.country && (
                          <p className='text-[8px] text-[#FF3B30] font-bold uppercase tracking-widest'>
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-[8px] font-bold tracking-[0.3em] uppercase text-zinc-400'>
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        {...register('notes')}
                        placeholder='GATE CODE, UNIT NUMBER, OR SPECIAL COURIER DIRECTIONS'
                        rows={3}
                        className='w-full bg-zinc-50 border border-zinc-100 p-5 text-[11px] font-bold tracking-widest outline-none focus:border-zinc-900 transition-colors uppercase'
                      />
                    </div>

                    <div className='flex items-center gap-4 py-2'>
                      <input
                        type='checkbox'
                        id='saveAddress'
                        {...register('saveAddress')}
                        className='w-5 h-5 accent-[#FF3B30] rounded-sm'
                      />
                      <label htmlFor='saveAddress' className='text-[10px] font-bold tracking-widest uppercase text-zinc-500 cursor-pointer'>
                        Save this address for future manifests
                      </label>
                    </div>
                  </form>
                  <button
                    onClick={handleSubmit(nextStep, (err) => {
                      console.log(err);
                      toast.error('PLEASE COMPLETE ALL MANDATORY FIELDS');
                    })}
                    className='group flex items-center gap-6 bg-zinc-900 text-white px-12 py-6 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#FF3B30] transition-all duration-700 rounded-full'>
                    Proceed to Payment
                    <ArrowRight
                      size={14}
                      className='group-hover:translate-x-2 transition-transform'
                    />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key='payment'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-12'>
                  <h2 className='text-4xl md:text-6xl font-prata text-zinc-900 tracking-tight'>
                    Payment Selection
                  </h2>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <button
                      onClick={() => setPaymentMethod('paymongo')}
                      className={`p-8 border-2 transition-all duration-500 rounded-sm flex flex-col gap-6 text-left ${paymentMethod === 'paymongo' ? 'border-[#FF3B30] bg-zinc-50 shadow-lg' : 'border-zinc-100 bg-white hover:border-zinc-300'}`}>
                      <div className='flex items-center justify-between w-full'>
                        <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center border border-zinc-200'>
                          <CreditCard
                            size={18}
                            strokeWidth={1}
                          />
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-4 ${paymentMethod === 'paymongo' ? 'border-[#FF3B30]' : 'border-zinc-200'}`}
                        />
                      </div>
                      <div>
                        <p className='text-[11px] font-black tracking-[0.2em] uppercase'>
                          PayMongo Portal
                        </p>
                        <p className='text-[9px] text-zinc-400 tracking-widest uppercase mt-2'>
                          Visa, Mastercard, GCash
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-8 border-2 transition-all duration-500 rounded-sm flex flex-col gap-6 text-left ${paymentMethod === 'cod' ? 'border-[#FF3B30] bg-zinc-50 shadow-lg' : 'border-zinc-100 bg-white hover:border-zinc-300'}`}>
                      <div className='flex items-center justify-between w-full'>
                        <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center border border-zinc-200'>
                          <Truck
                            size={18}
                            strokeWidth={1}
                          />
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-4 ${paymentMethod === 'cod' ? 'border-[#FF3B30]' : 'border-zinc-200'}`}
                        />
                      </div>
                      <div>
                        <p className='text-[11px] font-black tracking-[0.2em] uppercase'>
                          Cash on Delivery
                        </p>
                        <p className='text-[9px] text-zinc-400 tracking-widest uppercase mt-2'>
                          Pay upon arrival
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className='p-8 bg-zinc-50 rounded-sm space-y-6'>
                    <div className='flex items-center gap-4 text-[#FF3B30]'>
                      <ShieldCheck size={18} />
                      <span className='text-[10px] font-black tracking-[0.2em] uppercase'>
                        Vault-Level Security
                      </span>
                    </div>
                    <p className='text-[11px] text-zinc-400 font-outfit uppercase leading-relaxed tracking-widest'>
                      {paymentMethod === 'paymongo'
                        ? 'Your transaction is encrypted and processed via PayMongo Secure API. We do not store your credentials.'
                        : 'Please ensure the exact amount is ready upon delivery for a smooth concierge experience.'}
                    </p>
                  </div>

                  <div className='flex flex-col sm:flex-row gap-6 pt-8'>
                    <button
                      onClick={onHandlePayment}
                      disabled={isProcessing}
                      className='flex-1 bg-zinc-900 text-white py-7 text-[10px] font-bold tracking-[0.6em] uppercase hover:bg-[#FF3B30] transition-all duration-700 rounded-full disabled:opacity-50'>
                      {isProcessing
                        ? 'AUTHENTICATING...'
                        : `Confirm Order — ₱${(
                            getTotal() +
                            (getTotal() >= 3000 ? 0 : 150) +
                            getTotal() * 0.12
                          ).toLocaleString()}`}
                    </button>
                    <button
                      onClick={prevStep}
                      className='px-12 py-7 text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors'>
                      Back to Shipping
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className='lg:col-span-5'>
            <div className='sticky top-32 p-12 bg-zinc-50 rounded-sm border border-zinc-100 space-y-12'>
              <h3 className='text-[10px] font-black tracking-[0.6em] uppercase text-zinc-400 border-b border-zinc-200 pb-6'>
                Manifest Summary
              </h3>

              <div className='space-y-8 max-h-[400px] overflow-y-auto no-scrollbar'>
                {items.map((item) => (
                  <div
                    key={item._id}
                    className='flex gap-6'>
                    <div className='relative w-20 aspect-3/4 bg-white border border-zinc-200 shrink-0'>
                      <Image
                        src={item.image[0]}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 flex flex-col justify-center space-y-2'>
                      <p className='text-[11px] font-black tracking-[0.15em] uppercase text-zinc-900'>
                        {item.name}
                      </p>
                      <div className='flex justify-between items-center'>
                        <p className='text-[10px] text-zinc-400 tracking-widest'>
                          Qty: {item.quantity}
                        </p>
                        <p className='text-[10px] font-bold tracking-widest'>
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='space-y-6 pt-12 border-t border-zinc-200'>
                <div className='flex justify-between text-[10px] tracking-widest uppercase'>
                  <span className='text-zinc-400'>Subtotal</span>
                  <span className='font-bold text-zinc-900'>
                    ₱{getTotal().toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between text-[10px] tracking-widest uppercase'>
                  <span className='text-zinc-400'>Shipping</span>
                  <span
                    className={`font-bold ${getTotal() >= 3000 ? 'text-[#FF3B30]' : 'text-zinc-900'}`}>
                    {getTotal() >= 3000 ? 'COMPLIMENTARY' : `₱150`}
                  </span>
                </div>
                <div className='flex justify-between text-[10px] tracking-widest uppercase'>
                  <span className='text-zinc-400'>Estimated Tax (12%)</span>
                  <span className='font-bold text-zinc-900'>
                    ₱{(getTotal() * 0.12).toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between text-[14px] tracking-[0.3em] uppercase pt-6 border-t border-zinc-100'>
                  <span className='font-black text-zinc-900'>Grand Total</span>
                  <span className='font-black text-zinc-900'>
                    ₱
                    {(
                      getTotal() +
                      (getTotal() >= 3000 ? 0 : 150) +
                      getTotal() * 0.12
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
