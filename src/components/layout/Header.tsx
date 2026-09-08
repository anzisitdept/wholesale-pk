'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStoreData } from '@/context/StoreDataContext';
import HeaderCategoryNav from './HeaderCategoryNav';

export default function Header() {
  const { totalCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const { categories } = useStoreData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        // Hide header when scrolling down past the hero, show when near top or scrolling up
        if (y > lastY && y > 120) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock background scroll while the drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileCategory = (catId: string) => {
    setExpandedMobileCategory(prev => (prev === catId ? null : catId));
  };

  return (
    <>
      <header className={`bg-[#000000] border-b border-white/20 sticky top-0 z-40 shadow-xs transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="container mx-auto px-3 md:px-4 lg:px-8 py-3 lg:py-4">

          {/* Top Header Row */}
          <div className="flex items-center justify-between gap-2">

            {/* Mobile Menu Toggle */}
            <button
              suppressHydrationWarning
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Logo — this wrapper's height is what sizes the header row. */}
            <div className="flex-shrink-0 relative h-12 sm:h-14 md:h-14 w-36 sm:w-40 md:w-36">
              <Link
                href="/"
                className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center z-10"
              >
                <img
                  src="/Wholesaler Logo 2.png"
                  alt="Wholesaler-PK"
                  className="h-24 sm:h-20 md:h-26 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right Side Info & Actions */}
            <div className="flex flex-col items-end min-w-0">
              {/* Customer Service Text */}
              <div className="hidden md:block text-[11px] text-white font-semibold text-right mb-2">
                Customer Service<br />
                WhatsApp & Cell 0310-0005480
              </div>

              {/* Actions Row: Search, Shopping Cart, Wishlist, Sign in */}
              <div className="flex items-center space-x-1.5 sm:space-x-3 md:space-x-5 text-sm">

                {/* Search Bar Trigger */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center bg-white/10 text-white px-2 sm:px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-semibold hover:bg-white/20 transition"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:mr-2" />
                  <span className="hidden md:inline">Search products...</span>
                </button>

                {/* Shopping Cart Button */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center space-x-1.5 text-white font-bold text-[10px] md:text-xs hover:opacity-80 transition"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    {mounted && totalCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-extrabold animate-pulse">
                        {totalCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Shopping Cart</span>
                </button>

                {/* Sign in Link connected to /account */}
                <Link
                  href="/account"
                  className="flex items-center space-x-1.5 text-white font-bold text-[10px] md:text-xs hover:opacity-80 transition border-l border-white/20 pl-1.5 sm:pl-3 md:pl-4"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Sign in</span>
                </Link>

              </div>
            </div>

          </div>

          {/* Navigation Row - Desktop: Integrated Separate Component */}
          <div className="mt-3 hidden lg:block border-t pt-2.5 border-white/20">
            <HeaderCategoryNav />
          </div>

        </div>
      </header>

      {/* Mobile Off-Canvas Menu (slides in from the left) */}
      {mounted && createPortal(
        <div
          className={`lg:hidden fixed inset-0 z-[100] ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          aria-hidden={!mobileMenuOpen}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Drawer Panel */}
          <div
            className={`absolute top-0 left-0 h-full w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            {/* Dark "Menu" header bar */}
            <div className="flex items-center justify-between bg-black px-4 py-4 flex-shrink-0">
              <span className="text-white font-bold text-base">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white p-1"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Items with Accordion Categories */}
            <nav className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {/* Static Top Links */}
              <Link
                href="/collections/all-products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-black font-bold text-sm tracking-wide"
              >
                <span>All Products</span>
              </Link>

              <Link
                href="/collections/new-arrivals"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-black font-bold text-sm tracking-wide"
              >
                <span>New Arrivals</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white">
                  NEW
                </span>
              </Link>

              {/* Dynamic Categories with Accordions */}
              {categories.map((cat) => {
                const subs = cat.subcategories || [];
                const hasSubs = subs.length > 0;
                const isExpanded = expandedMobileCategory === cat.id;

                if (!hasSubs) {
                  return (
                    <Link
                      key={cat.id}
                      href={`/collections/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 text-black font-bold text-sm tracking-wide"
                    >
                      <span>{cat.name.replace(/\s*\([^)]*\)/g, '')}</span>
                    </Link>
                  );
                }

                return (
                  <div key={cat.id} className="bg-white">
                    {/* Main Category Header Row */}
                    <div className="flex items-center justify-between px-4 py-3.5 text-black font-bold text-sm">
                      <Link
                        href={`/collections/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 text-black font-bold tracking-wide hover:opacity-75 transition"
                      >
                        {cat.name.replace(/\s*\([^)]*\)/g, '')}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleMobileCategory(cat.id)}
                        className="p-1 text-gray-500 hover:text-black transition"
                        aria-label={`Toggle ${cat.name} subcategories`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-black' : 'rotate-0'
                            }`}
                        />
                      </button>
                    </div>

                    {/* Accordion Content: Nested Sub-Categories with 36x36px Visual Images */}
                    {isExpanded && (
                      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex flex-col gap-2">
                        {subs.map((sub) => (
                          <Link
                            key={sub.id || sub.slug}
                            href={`/collections/${cat.slug}/${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-lg bg-white border border-gray-100 hover:border-gray-300 transition"
                          >
                            {/* 36x36 Thumbnail */}
                            <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                              {sub.image ? (
                                <img
                                  src={sub.image}
                                  alt={sub.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Tag size={15} className="text-gray-400" />
                              )}
                            </div>

                            {/* Titles */}
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-xs font-semibold text-gray-900 truncate">
                                {sub.name}
                              </span>
                              {sub.urduName && (
                                <span className="text-[10px] text-gray-500 truncate" dir="rtl" style={{ textAlign: 'left' }}>
                                  {sub.urduName}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}

                        {/* View All In Category Link */}
                        <Link
                          href={`/collections/${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-center text-xs font-bold text-black py-2 mt-1 hover:underline"
                        >
                          View all in {cat.name.replace(/\s*\([^)]*\)/g, '')} &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Best Selling Link */}
              <Link
                href="/collections/best-selling"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-black font-bold text-sm tracking-wide"
              >
                <span>Best Selling</span>
              </Link>
            </nav>

            {/* Bottom Drawer Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 space-y-2">
              <div className="font-semibold text-black">Customer Service:</div>
              <div>WhatsApp: 0310-0005480</div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}