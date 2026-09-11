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
  MessageCircle,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { WHATSAPP_CUSTOM_DESIGN_URL } from '@/lib/whatsapp';

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

function EarringsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="6" r="1.5" />
      <path d="M8 7.5v6" />
      <circle cx="8" cy="16.5" r="2.5" />
      <circle cx="16" cy="6" r="1.5" />
      <path d="M16 7.5v6" />
      <circle cx="16" cy="16.5" r="2.5" />
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

function JewelrySetIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3c1 5 4 8 6 8s5-3 6-8" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="8" cy="18" r="3" />
      <path d="M6.5 15.5L8 14l1.5 1.5" />
      <circle cx="16" cy="17" r="3" />
      <path d="M14.5 14.5L16 13l1.5 1.5" />
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
            className="fixed top-3.5 right-3.5 z-[110] w-10 h-10 rounded-full bg-[#202328]/85 text-white/90 hover:text-white flex items-center justify-center border border-white/10 hover:bg-[#2c3038] active:scale-95 transition shadow-lg cursor-pointer"
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
            className="relative w-[84%] max-w-[340px] h-full bg-[#141415] text-[#f4f4f5] flex flex-col z-[105] shadow-2xl border-r border-[#22252c] overflow-hidden"
          >
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 pt-3 pb-2">
              
              {/* 1. TOP ROW: User Profile or Sign In / Join */}
              {user ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] mb-3 border border-white/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#007aff] text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
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
                  <div className="w-10 h-10 rounded-full bg-[#202328] text-gray-200 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2c3038] transition border border-white/5">
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
                className="block relative w-full mb-3.5 rounded-2xl overflow-hidden hover:opacity-90 active:scale-[0.99] transition group shadow-md"
              >
                <img
                  src="/free-cod.png"
                  alt="FREE Cash on Delivery (COD) on All Orders"
                  className="w-full h-auto object-cover block rounded-2xl -my-3"
                />
              </Link>

              {/* 3. PRIMARY MENU ITEMS (Necklaces, Rings, Earrings, Bracelets, Collections) */}
              <nav className="flex flex-col space-y-0.5">
                
                {/* Necklaces */}
                <div>
                  <div
                    onClick={() => toggleSection('necklaces')}
                    className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <NecklaceIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                        Necklaces
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        expandedMenu === 'necklaces' ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {expandedMenu === 'necklaces' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-11 pr-2 py-1 flex flex-col space-y-1"
                      >
                        <Link href="/collections/all-products?category=necklaces" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          All Necklaces
                        </Link>
                        <Link href="/collections/all-products?category=pendant-necklaces" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          Pendants &amp; Chains
                        </Link>
                        <Link href="/collections/all-products?category=chokers" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          Chokers
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rings */}
                <div>
                  <div
                    onClick={() => toggleSection('rings')}
                    className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <RingIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                        Rings
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        expandedMenu === 'rings' ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {expandedMenu === 'rings' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-11 pr-2 py-1 flex flex-col space-y-1"
                      >
                        <Link href="/collections/all-products?category=rings" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          All Rings
                        </Link>
                        <Link href="/collections/all-products?category=diamond-rings" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          Diamond Rings
                        </Link>
                        <Link href="/collections/all-products?category=bands" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          Bands &amp; Stacks
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Earrings */}
                <Link
                  href="/collections/all-products?category=earrings"
                  onClick={onClose}
                  className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <EarringsIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Earrings
                    </span>
                  </div>
                </Link>

                {/* Bracelets */}
                <div>
                  <div
                    onClick={() => toggleSection('bracelets')}
                    className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <BraceletIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                        Bracelets
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        expandedMenu === 'bracelets' ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {expandedMenu === 'bracelets' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-11 pr-2 py-1 flex flex-col space-y-1"
                      >
                        <Link href="/collections/all-products?category=bracelets" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          All Bracelets
                        </Link>
                        <Link href="/collections/all-products?category=bangles" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          Bangles &amp; Cuffs
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Collections */}
                <div>
                  <div
                    onClick={() => toggleSection('collections')}
                    className="flex items-center justify-between h-[46px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <JewelrySetIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                        Collections
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        expandedMenu === 'collections' ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {expandedMenu === 'collections' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-11 pr-2 py-1 flex flex-col space-y-1"
                      >
                        <Link href="/collections/all-products" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          All Collections
                        </Link>
                        <Link href="/collections/all-products?filter=new" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          New Arrivals
                        </Link>
                        <Link href="/collections/all-products?filter=best" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          Best Sellers
                        </Link>
                        <Link href="/collections/all-products?filter=bundle" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          Bundle Offers
                        </Link>
                        <Link href="/collections/all-products?filter=gift" onClick={onClose} className="py-1.5 text-xs text-gray-300 hover:text-white transition">
                          Gift Guides
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </nav>

              {/* 4. SUBTLE DIVIDER LINE */}
              <div className="h-px bg-white/10 my-3 mx-1" />

              {/* 5. SECONDARY 2-COLUMN GRID (Gift Guides, Custom Design, Fine Watches, Men's Jewelry, Care & Sizing, Store Locator) */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 px-1 py-1">
                
                {/* Gift Guides */}
                <Link
                  href="/collections/all-products?filter=gift"
                  onClick={onClose}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group min-w-0"
                >
                  <Gift className="w-5 h-5 text-gray-400 group-hover:text-white flex-shrink-0 transition" />
                  <span className="text-xs sm:text-[13px] font-medium text-gray-200 group-hover:text-white truncate">
                    Gift Guides
                  </span>
                </Link>

                {/* Custom Design */}
                <a
                  href={WHATSAPP_CUSTOM_DESIGN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group min-w-0"
                >
                  <CustomDesignIcon className="w-5 h-5 text-gray-400 group-hover:text-white flex-shrink-0 transition" />
                  <span className="text-xs sm:text-[13px] font-medium text-gray-200 group-hover:text-white leading-tight truncate">
                    Custom Design
                  </span>
                </a>

                {/* Fine Watches */}
                <Link
                  href="/collections/all-products?category=watches"
                  onClick={onClose}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group min-w-0"
                >
                  <Watch className="w-5 h-5 text-gray-400 group-hover:text-white flex-shrink-0 transition" />
                  <span className="text-xs sm:text-[13px] font-medium text-gray-200 group-hover:text-white truncate">
                    Fine Watches
                  </span>
                </Link>

                {/* Men's Jewelry */}
                <Link
                  href="/collections/all-products?category=mens-jewelry"
                  onClick={onClose}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group min-w-0"
                >
                  <ChainIcon className="w-5 h-5 text-gray-400 group-hover:text-white flex-shrink-0 transition" />
                  <span className="text-xs sm:text-[13px] font-medium text-gray-200 group-hover:text-white truncate">
                    Men&apos;s Jewelry
                  </span>
                </Link>

                {/* Care & Sizing */}
                <Link
                  href="/pages/frequently-asked-questions"
                  onClick={onClose}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group min-w-0"
                >
                  <SizingIcon className="w-5 h-5 text-gray-400 group-hover:text-white flex-shrink-0 transition" />
                  <span className="text-xs sm:text-[13px] font-medium text-gray-200 group-hover:text-white truncate">
                    Care &amp; Sizing
                  </span>
                </Link>

                {/* Store Locator */}
                <Link
                  href="/pages/contact-us"
                  onClick={onClose}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group min-w-0"
                >
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-white flex-shrink-0 transition" />
                  <span className="text-xs sm:text-[13px] font-medium text-gray-200 group-hover:text-white truncate">
                    Store Locator
                  </span>
                </Link>

              </div>

              {/* Social Icons Row (WhatsApp, TikTok, Instagram) */}
              <div className="grid grid-cols-3 gap-2 px-1 mt-2">
                <a
                  href="https://wa.me/923100005480"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="h-10 rounded-xl bg-[#202328] hover:bg-[#2b2f38] text-gray-300 hover:text-white flex items-center justify-center border border-white/5 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="h-10 rounded-xl bg-[#202328] hover:bg-[#2b2f38] text-gray-300 hover:text-white flex items-center justify-center border border-white/5 transition"
                >
                  <TiktokIcon className="w-5 h-5" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-10 rounded-xl bg-[#202328] hover:bg-[#2b2f38] text-gray-300 hover:text-white flex items-center justify-center border border-white/5 transition"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>

              {/* 24/7 Support Button */}
              <a
                href="https://wa.me/923100005480?text=Hello%20Customer%20Support"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 h-10 rounded-xl bg-[#007aff] hover:bg-[#0066dd] active:bg-[#0055cc] px-2.5 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#202328] flex items-center justify-center text-white border border-white/5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-100">
                    Support
                  </span>
                </div>
                <span className="text-xs font-black tracking-wide px-3 py-1 rounded-full bg-[#007aff] text-white shadow-sm font-display">
                  24/7
                </span>
              </a>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
