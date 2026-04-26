'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, RefreshCcw } from 'lucide-react';

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

export default function QuizPage() {
  const [step, setStep] = useState(0); // 0: Start, 1-3: Questions, 4: Result
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

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

  const calculateResult = (finalAnswers: string[]) => {
    // Simple logic: Find a product that matches the gender/category preference
    const categoryPreference = finalAnswers[1];
    const filtered = products.filter((p) => p.category === categoryPreference);
    const recommendation =
      filtered[Math.floor(Math.random() * filtered.length)] || products[0];

    setResult(recommendation);
    setStep(questions.length + 1);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-center px-6 pt-20'>
      <div className='max-w-2xl w-full'>
        <AnimatePresence mode='wait'>
          {/* STEP 0: INTRO */}
          {step === 0 && (
            <motion.div
              key='intro'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='text-center space-y-8'>
              <span className='text-[10px] tracking-[0.5em] text-rose-500 font-bold uppercase'>
                Scent Finder
              </span>
              <h1 className='text-6xl font-prata text-zinc-900'>
                Find Your Sillage
              </h1>
              <p className='text-zinc-600 text-sm leading-relaxed max-w-md mx-auto font-outfit'>
                Discover the fragrance that perfectly captures your essence and
                leaves the impression you desire.
              </p>
              <button
                onClick={startQuiz}
                className='bg-black text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase rounded-full hover:bg-rose-500 transition-all'>
                BEGIN DISCOVERY
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
              className='space-y-12'>
              <div className='flex justify-between items-end'>
                <span className='text-[10px] font-bold text-rose-500'>
                  0{step} / 0{questions.length}
                </span>
                <div className='h-px flex-1 mx-8 bg-zinc-100 relative'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / questions.length) * 100}%` }}
                    className='absolute inset-0 bg-rose-500'
                  />
                </div>
              </div>

              <h2 className='text-4xl font-prata text-zinc-900 leading-tight'>
                {questions[step - 1].question}
              </h2>

              <div className='grid grid-cols-1 gap-4'>
                {questions[step - 1].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.value)}
                    className='group flex items-center justify-between p-6 border border-zinc-100 rounded-sm hover:border-zinc-900 transition-all text-left'>
                    <span className='text-sm font-outfit text-zinc-600 group-hover:text-zinc-900'>
                      {option.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className='opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all'
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {step > questions.length && result && (
            <motion.div
              key='result'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center space-y-12'>
              <div className='space-y-4'>
                <span className='text-[10px] tracking-[0.5em] text-rose-500 font-bold uppercase'>
                  Your Signature Identity
                </span>
                <h2 className='text-5xl font-prata text-zinc-900'>
                  Found: {result.name}
                </h2>
              </div>

              <div className='relative aspect-4/5 max-w-sm mx-auto overflow-hidden rounded-sm shadow-2xl'>
                <Image
                  src={result.image[0]}
                  alt={result.name}
                  fill
                  className='object-cover'
                />
              </div>

              <div className='space-y-6'>
                <p className='text-zinc-600 text-sm font-outfit italic'>
                  "{result.description}"
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Link
                    href={`/products/${result._id}`}
                    className='bg-black text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-rose-500 transition-all'>
                    SHOP THIS SCENT — ₱{result.price}
                  </Link>
                  <button
                    onClick={resetQuiz}
                    className='flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:text-rose-500 transition-colors'>
                    <RefreshCcw size={14} /> RETAKE QUIZ
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
