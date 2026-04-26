'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { assets } from '../assets/assets';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src={assets.perfumesHero1} 
          alt="Atelier" 
          fill 
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center space-y-4 px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] tracking-[0.8em] text-rose-300 font-bold uppercase block"
          >
            Sillage Concierge
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-prata text-white tracking-tighter"
          >
            How can we <br/> <span className="italic pl-12 md:pl-24 text-white/80">assist you?</span>
          </motion.h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          
          {/* Left Column: Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-24"
          >
            <div className="space-y-12">
              <h2 className="text-4xl font-prata text-zinc-900">Direct Inquiries</h2>
              <div className="space-y-12">
                <div className="group cursor-pointer">
                  <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase mb-4">The Atelier</p>
                  <p className="text-xl font-outfit text-zinc-800 leading-relaxed group-hover:text-rose-500 transition-colors">
                    15 Savile Row, Mayfair<br />
                    London, W1S 3PJ
                  </p>
                </div>
                <div className="group cursor-pointer">
                  <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase mb-4">Electronic Mail</p>
                  <p className="text-xl font-outfit text-zinc-800 group-hover:text-rose-500 transition-colors">
                    concierge@sillage.com
                  </p>
                </div>
                <div className="group cursor-pointer">
                  <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase mb-4">Telephone</p>
                  <p className="text-xl font-outfit text-zinc-800 group-hover:text-rose-500 transition-colors">
                    +44 (0) 20 7946 0958
                  </p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-6 mt-20">
              <button className="h-10 w-10 flex items-center justify-center hover:text-rose-400 transition-colors"><Instagram size={20} strokeWidth={1.5} /></button>
              <button className="h-10 w-10 flex items-center justify-center hover:text-rose-400 transition-colors"><Facebook size={20} strokeWidth={1.5} /></button>
              <button className="h-10 w-10 flex items-center justify-center hover:text-rose-400 transition-colors"><Twitter size={20} strokeWidth={1.5} /></button>
            </div>
          </motion.div>

          {/* Right Column: The Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-50 p-12 md:p-20 border border-zinc-100 relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <span className="text-8xl font-prata italic">S</span>
            </div>
            
            <form className="space-y-12 relative z-10">
              <div className="space-y-8">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 group-focus-within:text-rose-500 transition-colors">Full Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-zinc-200 py-4 focus:border-zinc-900 outline-none transition-all font-outfit text-lg" placeholder="Johnathan Doe" />
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 group-focus-within:text-rose-500 transition-colors">Email Address</label>
                  <input type="email" className="w-full bg-transparent border-b border-zinc-200 py-4 focus:border-zinc-900 outline-none transition-all font-outfit text-lg" placeholder="john@sillage.com" />
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 group-focus-within:text-rose-500 transition-colors">Nature of Inquiry</label>
                  <select className="w-full bg-transparent border-b border-zinc-200 py-4 focus:border-zinc-900 outline-none transition-all font-outfit text-lg appearance-none cursor-pointer">
                    <option>Fragrance Consultation</option>
                    <option>Order Assistance</option>
                    <option>Bespoke Services</option>
                    <option>Press & Media</option>
                  </select>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 group-focus-within:text-rose-500 transition-colors">Your Message</label>
                  <textarea rows={4} className="w-full bg-transparent border-b border-zinc-200 py-4 focus:border-zinc-900 outline-none transition-all font-outfit text-lg resize-none" placeholder="How may we assist you today?" />
                </div>
              </div>

              <button className="group flex items-center gap-6 bg-zinc-900 text-white px-12 py-6 text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-rose-500 transition-all w-full justify-center">
                Submit Request
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>

      {/* Map/Location Section */}
      <section className="h-[50vh] bg-zinc-100 grayscale hover:grayscale-0 transition-all duration-1000 relative flex items-center justify-center">
         <div className="text-center z-10">
            <span className="text-[10px] tracking-[1em] uppercase text-zinc-400 mb-4 block">Our Home</span>
            <h2 className="text-4xl font-prata text-zinc-900">London Atelier</h2>
         </div>
         <Image src={assets.perfumesHero} alt="Map Background" fill className="object-cover opacity-20" />
      </section>
    </div>
  );
}
