import type { Metadata } from "next";
import { Outfit, Prata, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { cn } from "@/lib/utils";
import AuthProvider from "./components/AuthProvider";
import CartSync from "./components/CartSync";
import { Toaster } from "react-hot-toast";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const prata = Prata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-prata",
});

export const metadata: Metadata = {
  title: "Sillage | Premium Perfume E-commerce",
  description: "Discover your signature scent with our curated collection of luxury perfumes.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", outfit.variable, prata.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-outfit">
        <AuthProvider>
          <CartSync />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fff',
                fontSize: '10px',
                letterSpacing: '0.2em',
                borderRadius: '0px',
                padding: '16px 24px',
              }
            }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}


