'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronDown,
  Gift,
  Watch,
  MapPin,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ─── Jewelry-specific SVG Icons to match screenshot ─────────────────── */

function RingIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="6.5" />
      <path d="M9.5 7.5L12 4l2.5 3.5" />
      <path d="M8.5 7.5h7" />
    </svg>
  );
}

function NecklaceIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4c1 9 7 13 8 13s7-4 8-13" />
      <circle cx="12" cy="19.5" r="2" />
      <path d="M12 17v0.5" />
    </svg>
  );
}

function BraceletIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="8" rx="8" ry="3.5" />
      <ellipse cx="12" cy="13" rx="8" ry="3.5" />
      <circle cx="12" cy="13" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HomeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function ShopIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11h16" />
      <path d="M5 6.5h14l1 4.5v10h-16v-10l1-4.5z" />
      <path d="M9 11v2a3 3 0 0 0 6 0v-2" />
      <path d="M9 6.5L12 3l3 3.5" />
    </svg>
  );
}

function FireLighterIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="10" width="12" height="11" rx="2" />
      <path d="M7 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <circle cx="15" cy="8.5" r="1" />
      <path d="M9.5 6C9.5 4.2 10.5 2.5 10.5 2.5S11.5 4.2 11.5 6a1 1 0 0 1-2 0z" fill="currentColor" fillOpacity="0.25" />
    </svg>
  );
}

function CustomDesignIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3l4 4L8 19H4v-4L16 3z" />
      <path d="M14 5l3 3" />
      <path d="M18 16l2-2 2 2-2 2z" />
    </svg>
  );
}

function ChainIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5c0 8 7 14 7 14s7-6 7-14" />
      <path d="M7 8c0 5 5 9 5 9s5-4 5-9" strokeDasharray="2 2" />
    </svg>
  );
}

function SizingIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
      <path d="M4 13h16" />
      <path d="M8 13v4" />
      <path d="M12 13v2.5" />
      <path d="M16 13v4" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.11V9.3a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.57a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.12c-.44-.36-.78-.83-1-1.35V6.69z" />
    </svg>
  );
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { user, profile, openAuthModal, signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and set up escape/tab handlers
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const toggleSection = (section: string) => {
    setExpandedMenu(prev => (prev === section ? null : section));
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[100] flex"
        >
          {/* Backdrop with fade and blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Floating Circular Close (X) button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-label="Close menu"
            className="fixed top-3.5 right-3.5 z-[110] w-10 h-10 rounded-full bg-[#580a06]/85 text-white/90 hover:text-white flex items-center justify-center border border-white/20 hover:bg-[#7a0f09] active:scale-95 transition shadow-lg cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </motion.button>

          {/* Left Slide-out Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-[84%] max-w-[340px] h-full bg-[#6f0c07] text-white flex flex-col z-[105] shadow-2xl border-r border-[#580a06] overflow-hidden"
          >
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 pt-3 pb-2">

              {/* 1. TOP ROW: User Profile or Sign In / Join */}
              {user ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] mb-3 border border-white/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white text-[#6f0c07] font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {profile?.displayName || user.displayName || 'Customer'}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {profile?.email || profile?.phone || user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal('register');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group mb-3 text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-white/15 text-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition border border-white/20">
                    <RingIcon className="w-5 h-5 text-gray-200" />
                  </div>
                  <span className="text-base font-bold text-white tracking-wide font-display">
                    Sign In / Join
                  </span>
                </button>
              )}

              {/* 2. PROMO BANNER: FREE Cash on Delivery (COD) on All Orders */}
              <Link
                href="/collections/all-products"
                onClick={onClose}
                className="block relative w-full mb-3.5 rounded-2xl overflow-hidden hover:opacity-90 active:scale-[0.99] transition group"
              >
                <img
                  src="/free-cod.png"
                  alt="FREE Cash on Delivery (COD) on All Orders"
                  className="w-full block"
                  style={{ height: '110px', objectFit: 'cover', objectPosition: 'center center' }}
                />
              </Link>

              {/* 3. PRIMARY MENU ITEMS (Home, Shop, Necklaces, Earrings, Rings, Bracelets) */}
              <nav className="flex flex-col space-y-0.5">

                {/* Home */}
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <HomeIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Home
                    </span>
                  </div>
                </Link>

                {/* Shop */}
                <Link
                  href="/collections/all-products"
                  onClick={onClose}
                  className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <ShopIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Shop
                    </span>
                  </div>
                </Link>

                {/* Necklaces */}
                <Link
                  href="/collections/necklaces"
                  onClick={onClose}
                  className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <NecklaceIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Necklaces
                    </span>
                  </div>
                </Link>

                {/* Rings */}
                <Link
                  href="/collections/rings"
                  onClick={onClose}
                  className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <RingIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Rings
                    </span>
                  </div>
                </Link>

                {/* Bracelets */}
                <Link
                  href="/collections/bracelets"
                  onClick={onClose}
                  className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <BraceletIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Bracelets
                    </span>
                  </div>
                </Link>

                {/* FireLighters */}
                <Link
                  href="/collections/firelighters"
                  onClick={onClose}
                  className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <FireLighterIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      FireLighters
                    </span>
                  </div>
                </Link>

                {/* Watches */}
                <Link
                  href="/collections/watches"
                  onClick={onClose}
                  className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <Watch className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Watches
                    </span>
                  </div>
                </Link>

              </nav>

              {/* 4. SUBTLE DIVIDER LINE */}
              <div className="h-px bg-white/10 my-3 mx-1" />


              {/* Social Icons Row (Facebook, TikTok, Instagram) */}
              <div className="grid grid-cols-3 gap-2 px-1 mt-2">
                <a
                  href="https://www.facebook.com/share/1JfmNRYKKp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="h-10 rounded-xl bg-white/15 hover:bg-white/25 text-gray-100 hover:text-white flex items-center justify-center border border-white/20 transition"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>

                <a
                  href="https://www.tiktok.com/@waadajewels"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="h-10 rounded-xl bg-white/15 hover:bg-white/25 text-gray-100 hover:text-white flex items-center justify-center border border-white/20 transition"
                >
                  <TiktokIcon className="w-5 h-5" />
                </a>

                <a
                  href="https://www.instagram.com/waadajewels?stkn=ZDlsMDdoenQ4Z3Rh"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-10 rounded-xl bg-white/15 hover:bg-white/25 text-gray-100 hover:text-white flex items-center justify-center border border-white/20 transition"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>

              {/* 24/7 Support Button */}
              <Link
                href="/pages/contact-us"
                onClick={onClose}
                className="mt-2 h-10 rounded-xl bg-white hover:bg-gray-100 active:bg-gray-200 px-2.5 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f5ecea] flex items-center justify-center text-[#6f0c07] border border-[#e8d8d5]">
                    <FacebookIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-[#6f0c07]">
                    Support
                  </span>
                </div>
                <span className="text-xs font-black tracking-wide px-3 py-1 rounded-full bg-[#6f0c07] text-white shadow-sm font-display">
                  24/7
                </span>
              </Link>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
