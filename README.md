# Sillage Lab: The Olfactive E-Commerce & Curator Suite

Sillage Lab is a premium, high-end fragrance e-commerce platform designed for the modern connoisseur. It combines a minimalist, luxury aesthetic with a robust technical foundation, featuring an interactive scent recommendation engine and a comprehensive administrative suite for boutique management.

![Project Status](https://img.shields.io/badge/Status-100%25%20Pristine-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20TypeScript%20%7C%20Supabase-black)

## 💎 Core Experiences

### 1. The Boutique (Frontend)
- **Signature Scent Finder**: An interactive, AI-driven quiz that synchronizes with the user's profile to provide personalized fragrance recommendations.
- **Premium Gallery**: High-performance product listings with sophisticated filtering and real-time inventory detection.
- **Identity Concierge**: Dedicated user profiles featuring order archives, preference management, and mailing list synchronization.
- **Secure Checkout**: Integrated with **PayMongo** for a seamless, enterprise-grade payment experience (Cards, GCash, PayMaya).

### 2. The Curator Suite (Admin)
- **Modular Dashboard**: Real-time revenue insights and logistics intelligence.
- **Fragrance Manifest Management**: Full CRUD capabilities for the product collection, including multi-image uploads to Supabase Storage.
- **Active Logistics**: Order fulfillment system with automatic stock decrementing and status synchronization.
- **Zero-Warning Architecture**: 100% type-safe codebase with optimized React performance hooks.

## 🛠 Technical Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Backend/Auth** | [Supabase](https://supabase.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Payments** | [PayMongo](https://www.paymongo.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Minel03/perfume-ecommerce.git
cd perfume-ecommerce
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PAYMONGO_SECRET_KEY=your_paymongo_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Launch Development
```bash
npm run dev
```

## 📐 Architecture
- **`/app`**: Core routing and page logic.
- **`/app/admin`**: Modular administrative dashboard components.
- **`/lib/supabase.ts`**: Centralized backend configuration.
- **`/lib/store`**: Persistent global state for Cart and Authentication.
- **`/app/assets`**: Static fragrance assets and fallback data.

## 🏆 Quality Standards
This project maintains a **100% Lint-Free** status. Every component is optimized for performance, using `useCallback`, `useMemo`, and strict TypeScript interfaces to prevent unnecessary re-renders and data desync.

---
*Crafted for the modern fragrance enthusiast by Sillage Lab Technical Team.*
