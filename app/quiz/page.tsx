'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../assets/assets';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { ArrowRight, RefreshCcw, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store/useAuthStore';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const questions = [
  {
    id: 1,
    question: 'How would you describe your ideal evening?',
    options: [
      { label: 'An elegant black-tie gala', value: 'formal' },
      { label: 'A cozy night by the fireplace', value: 'cozy' },
      { label: 'Exploring a vibrant city at night', value: 'mysterious' },
      { label: 'A quiet walk through a garden', value: 'fresh' },
    ],
  },
  {
    id: 2,
    question: 'Which scent family do you naturally gravitate towards?',
    options: [
      { label: 'Floral & Romantic', value: 'women' },
      { label: 'Woody & Earthy', value: 'men' },
      { label: 'Fresh & Citrusy', value: 'unisex' },
      { label: 'Rich & Oriental', value: 'men' },
    ],
  },
  {
    id: 3,
    question: 'What is your primary goal for a fragrance?',
    options: [
      { label: 'To command the room', value: 'bold' },
      { label: 'To feel clean and rejuvenated', value: 'light' },
      { label: 'To leave a mysterious trail', value: 'intense' },
      { label: 'To feel sophisticated and polished', value: 'balanced' },
    ],
  },
];

interface Product {
  _id: string;
  name: string;
  price: number;
  image: (string | StaticImageData)[];
  description: string;
  category: string;
}

export default function QuizPage() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(0); // 0: Start, 1-3: Questions, 4: Result
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startQuiz = () => setStep(1);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = async (finalAnswers: string[]) => {
    setIsProcessing(true);
    setStep(questions.length + 1);

    const vibe = finalAnswers[0];
    const categoryPreference = finalAnswers[1];
    const intensity = finalAnswers[2];

    // 1. Sync DNA to User Profile if logged in
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: {
            scent_profile: {
              vibe,
              category: categoryPreference,
              intensity,
              last_quiz: new Date().toISOString(),
            },
          },
        });
      } catch (e) {
        console.error('Profile sync error:', e);
      }
    }

    // 2. Intelligent Recommendation
    const filtered = products.filter((p) => p.category === categoryPreference);
    const fallbackIndex = finalAnswers.join('').length % filtered.length;

    const recommendation =
      filtered.find((p) =>
        p.description.toLowerCase().includes(vibe.toLowerCase()),
      ) ||
      filtered[fallbackIndex] ||
      products[0];

    // Simulate luxury processing
    setTimeout(() => {
      setResult(recommendation as Product);
      setIsProcessing(false);
    }, 2500);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center px-6 py-32 relative overflow-y-auto'>
      {/* Background Detail */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-50/20 rounded-full blur-3xl -z-10' />

      <div className='max-w-3xl w-full'>
        <AnimatePresence mode='wait'>
          {/* STEP 0: INTRO */}
          {step === 0 && (
            <motion.div
              key='intro'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className='text-center flex flex-col items-center'>
              <div className='mb-16'>
                <motion.span
                  initial={{ opacity: 0, letterSpacing: '0.2em' }}
                  animate={{ opacity: 1, letterSpacing: '0.8em' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className='text-[10px] md:text-[11px] text-[#FF3B30] font-black uppercase mb-10 block leading-none font-sans tracking-[0.8em] ml-[0.8em]'>
                  SCENT FINDER
                </motion.span>
                <h1 className='text-6xl md:text-[8rem] font-prata text-zinc-900 leading-[1.1] tracking-tight'>
                  Find Your Sillage
                </h1>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className='text-zinc-400 text-[10px] md:text-xs tracking-[0.2em] max-w-sm mx-auto leading-relaxed font-outfit uppercase mb-16'>
                Discover the fragrance that perfectly captures your essence and
                leaves the impression you desire.
              </motion.p>

              <button
                onClick={startQuiz}
                className='group relative px-16 py-6 overflow-hidden border border-zinc-200 rounded-full transition-all duration-500 hover:border-zinc-900'>
                <span className='relative z-10 text-[10px] font-bold tracking-[0.6em] text-zinc-900 transition-colors duration-500 group-hover:text-white uppercase'>
                  Begin Discovery
                </span>
                <span className='absolute inset-0 bg-zinc-900 transform translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0' />
              </button>
            </motion.div>
          )}

          {/* QUESTIONS */}
          {step > 0 && step <= questions.length && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className='space-y-16 pb-24'>
              <div className='flex justify-between items-end'>
                <span className='text-[10px] font-bold text-[#FF3B30] tracking-[0.2em] uppercase'>
                  Step 0{step} <span className='text-zinc-300 mx-2'>/</span> 0
                  {questions.length}
                </span>
                <div className='h-[2px] flex-1 mx-8 bg-zinc-100 relative overflow-hidden'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / questions.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'circOut' }}
                    className='absolute inset-0 bg-[#FF3B30]'
                  />
                </div>
              </div>

              <div className='space-y-12'>
                <h2 className='text-4xl md:text-6xl font-prata text-zinc-900 leading-[1.1] tracking-tight'>
                  {questions[step - 1].question}
                </h2>

                <div className='grid grid-cols-1 gap-4'>
                  {questions[step - 1].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option.value)}
                      className='group flex items-center justify-between p-8 border border-zinc-100 rounded-sm hover:border-zinc-900 hover:bg-zinc-50/50 transition-all text-left'>
                      <span className='text-[11px] font-outfit font-bold uppercase tracking-[0.15em] text-zinc-500 group-hover:text-zinc-900'>
                        {option.label}
                      </span>
                      <ArrowRight
                        size={16}
                        className='text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-2 transition-all'
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULT OR PROCESSING */}
          {step > questions.length && (
            <motion.div
              key='result-container'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='w-full pb-24'>
              {isProcessing ? (
                <div className='flex flex-col items-center space-y-12 py-20'>
                  <div className='relative'>
                    <Loader2
                      className='animate-spin text-[#FF3B30]'
                      size={48}
                      strokeWidth={1}
                    />
                    <div className='absolute inset-0 blur-xl bg-[#FF3B30]/20 rounded-full animate-pulse' />
                  </div>
                  <div className='space-y-4 text-center'>
                    <motion.p
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className='text-[10px] font-bold tracking-[0.8em] uppercase text-zinc-400 ml-[0.8em]'>
                      Decoding Your Essence
                    </motion.p>
                    <Skeleton className='h-8 w-64 mx-auto' />
                  </div>
                  <Skeleton className='aspect-3/4 w-full max-w-sm rounded-sm' />
                </div>
              ) : result ? (
                <motion.div
                  key='result'
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className='text-center flex flex-col items-center space-y-16'>
                  <div className='space-y-6'>
                    <motion.span
                      initial={{ opacity: 0, letterSpacing: '0.2em' }}
                      animate={{ opacity: 1, letterSpacing: '0.6em' }}
                      className='text-[10px] text-[#FF3B30] font-bold uppercase block tracking-[0.6em] ml-[0.6em]'>
                      YOUR SIGNATURE IDENTITY
                    </motion.span>
                    <h2 className='text-5xl md:text-7xl font-prata text-zinc-900 tracking-tighter'>
                      Found: {result.name}
                    </h2>
                  </div>

                  <div className='relative aspect-3/4 w-full max-w-sm mx-auto overflow-hidden rounded-sm shadow-2xl group border border-zinc-100'>
                    <Image
                      src={result.image[0]}
                      alt={result.name}
                      fill
                      className='object-cover transition-transform duration-2000 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-black/5' />
                  </div>

                  <div className='space-y-10 w-full'>
                    <p className='text-zinc-500 text-[11px] font-outfit italic tracking-widest max-w-md mx-auto leading-relaxed'>
                      &quot;{result.description}&quot;
                    </p>
                    <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
                      <Link
                        href={`/products/${result._id}`}
                        className='bg-zinc-900 text-white px-16 py-6 text-[10px] font-bold tracking-[0.6em] uppercase hover:bg-[#FF3B30] transition-all duration-500 rounded-full'>
                        Shop This Scent — ₱{result.price.toLocaleString()}
                      </Link>
                      <button
                        onClick={resetQuiz}
                        className='group flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors'>
                        <RefreshCcw
                          size={14}
                          className='group-hover:rotate-180 transition-transform duration-700'
                        />
                        Retake Quiz
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
