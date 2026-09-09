'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Layers,
  Flame,
  Heart,
  Truck,
  Star,
  HelpCircle,
  Phone,
  MessageCircle,
  Send,
  MoreHorizontal,
  Tag,
} from 'lucide-react';
import { useStoreData } from '@/context/StoreDataContext';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const { categories } = useStoreData();
  const [mounted, setMounted] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [shopExpanded, setShopExpanded] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll & ESC key listener
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Basic focus trap
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

  const toggleCategory = (catId: string) => {
    setExpandedCategoryId(prev => (prev === catId ? null : catId));
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

          {/* Floating Circular Close (X) button outside drawer on top-right overlay */}
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
            className="relative w-[82%] max-w-[340px] h-full bg-[#141415] text-[#f4f4f5] flex flex-col z-[105] shadow-2xl border-r border-[#22252c] overflow-hidden"
          >
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 pt-3 pb-4">
              {/* 1. TOP ROW: User Avatar + Log in + Chevron */}
              <Link
                href="/account/login"
                onClick={onClose}
                className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group mb-2.5"
              >
                <div className="w-10 h-10 rounded-full bg-[#24262c] text-gray-300 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2e3138] transition">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-base font-bold text-white tracking-wide flex-1 font-body">
                  Log in
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5 transition" />
              </Link>

              {/* 3. PRIMARY NAV LIST */}
              <nav className="flex flex-col space-y-0.5">
                {/* Shop All Products */}
                <div>
                  <div
                    onClick={() => setShopExpanded(!shopExpanded)}
                    className="flex items-center justify-between h-[50px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <ShoppingBag className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                        Shop
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        shopExpanded ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>

                  {/* Shop Submenu */}
                  <AnimatePresence>
                    {shopExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-11 pr-2 py-1 flex flex-col space-y-1"
                      >
                        <Link
                          href="/collections/all-products"
                          onClick={onClose}
                          className="py-2 text-xs font-medium text-gray-300 hover:text-white transition flex items-center justify-between"
                        >
                          <span>All Products</span>
                        </Link>
                        <Link
                          href="/collections/new-arrivals"
                          onClick={onClose}
                          className="py-2 text-xs font-medium text-gray-300 hover:text-white transition flex items-center justify-between"
                        >
                          <span>New Arrivals</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#007aff] text-white">
                            NEW
                          </span>
                        </Link>
                        <Link
                          href="/collections/best-selling"
                          onClick={onClose}
                          className="py-2 text-xs font-medium text-gray-300 hover:text-white transition flex items-center justify-between"
                        >
                          <span>Best Selling</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Categories Accordion */}
                <div>
                  <div
                    onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                    className="flex items-center justify-between h-[50px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <Layers className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                      <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                        Categories
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        categoriesExpanded ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>

                  {/* Categories Submenu */}
                  <AnimatePresence>
                    {categoriesExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pl-11 pr-2 py-1 flex flex-col space-y-1.5"
                      >
                        {categories.map((cat) => {
                          const subs = cat.subcategories || [];
                          const hasSubs = subs.length > 0;
                          const isCatOpen = expandedCategoryId === cat.id;

                          if (!hasSubs) {
                            return (
                              <Link
                                key={cat.id}
                                href={`/collections/${cat.slug}`}
                                onClick={onClose}
                                className="py-1.5 text-xs font-medium text-gray-300 hover:text-white transition block"
                              >
                                {cat.name.replace(/\s*\([^)]*\)/g, '')}
                              </Link>
                            );
                          }

                          return (
                            <div key={cat.id} className="flex flex-col">
                              <div
                                onClick={() => toggleCategory(cat.id)}
                                className="flex items-center justify-between py-1.5 text-xs font-medium text-gray-300 hover:text-white transition cursor-pointer"
                              >
                                <span>{cat.name.replace(/\s*\([^)]*\)/g, '')}</span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                                    isCatOpen ? 'rotate-180 text-white' : ''
                                  }`}
                                />
                              </div>

                              {isCatOpen && (
                                <div className="pl-3 py-1 flex flex-col space-y-1.5 border-l border-white/10 my-1">
                                  {subs.map((sub) => (
                                    <Link
                                      key={sub.id || sub.slug}
                                      href={`/collections/${cat.slug}/${sub.slug}`}
                                      onClick={onClose}
                                      className="flex items-center gap-2.5 py-1 text-[11px] text-gray-400 hover:text-white transition"
                                    >
                                      {sub.image ? (
                                        <img
                                          src={sub.image}
                                          alt={sub.name}
                                          className="w-5 h-5 rounded-sm object-cover bg-[#20232a]"
                                        />
                                      ) : (
                                        <Tag className="w-3.5 h-3.5 text-gray-500" />
                                      )}
                                      <span className="truncate">{sub.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hot Deals */}
                <Link
                  href="/collections/best-selling"
                  onClick={onClose}
                  className="flex items-center justify-between h-[50px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <Flame className="w-5 h-5 text-gray-300 group-hover:text-amber-400 transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Deals & Offers
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ff5722] text-white">
                    HOT
                  </span>
                </Link>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center justify-between h-[50px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <Heart className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition" />
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white tracking-wide">
                      Wishlist
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition" />
                </Link>
              </nav>

              {/* 4. SUBTLE DIVIDER LINE */}
              <div className="h-px bg-[#262832] my-2.5 mx-1" />

              {/* 5. SECONDARY NAV LIST */}
              <nav className="flex flex-col space-y-0.5">
                {/* Track Order */}
                <Link
                  href="/pages/shipping-policy"
                  onClick={onClose}
                  className="flex items-center justify-between h-[48px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <Truck className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                      Track Order
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition" />
                </Link>

                {/* Customer Reviews */}
                <Link
                  href="/#reviews"
                  onClick={onClose}
                  className="flex items-center justify-between h-[48px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <Star className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                      Customer Reviews
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition" />
                </Link>

                {/* FAQs */}
                <Link
                  href="/pages/frequently-asked-questions"
                  onClick={onClose}
                  className="flex items-center justify-between h-[48px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                      FAQs
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition" />
                </Link>

                {/* Contact Us */}
                <Link
                  href="/pages/contact-us"
                  onClick={onClose}
                  className="flex items-center justify-between h-[48px] px-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <Phone className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                      Contact Us
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition" />
                </Link>
              </nav>

            </div>

            {/* 7. FIXED BOTTOM SECTION */}
            <div className="p-3 bg-[#17181c] border-t border-[#23262f] flex flex-col gap-2 flex-shrink-0">
              {/* Social Icons Row (WhatsApp, Telegram, Instagram, "...") */}
              <div className="grid grid-cols-4 gap-2">
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
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="h-10 rounded-xl bg-[#202328] hover:bg-[#2b2f38] text-gray-300 hover:text-white flex items-center justify-center border border-white/5 transition"
                >
                  <Send className="w-4 h-4" />
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

                <button
                  type="button"
                  aria-label="More options"
                  className="h-10 rounded-xl bg-[#202328] hover:bg-[#2b2f38] text-gray-300 hover:text-white flex items-center justify-center border border-white/5 transition cursor-pointer"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Support Row: Chat bubble + "Support" + blue "24/7" badge */}
              <a
                href="https://wa.me/923100005480?text=Hello%20Customer%20Support"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 rounded-xl bg-transparent hover:bg-white/[0.04] active:bg-white/[0.08] px-2.5 flex items-center justify-between transition cursor-pointer"
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
