'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import HeaderMainNav from './HeaderMainNav';
import MobileNavDrawer from './MobileNavDrawer';

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.11V9.3a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.57a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.12c-.44-.36-.78-.83-1-1.35V6.69z" />
    </svg>
  );
}

export default function Header() {
  const { totalCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const { user, profile, openAuthModal, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <>
      <header className={`bg-[#ffffff]/95 backdrop-blur-md border-b border-[#ece7e6] sticky top-0 z-40 shadow-xs transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="container mx-auto px-3 md:px-4 lg:px-8 py-3 lg:py-4">

          {/* Top Header Row */}
          <div className="flex items-center lg:justify-between gap-2">

            {/* Mobile Layout: 3 equal columns (menu+search | logo | cart) */}
            <div className="lg:hidden w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              {/* Left: Menu Toggle + Search */}
              <div className="flex items-center gap-1">
                <button
                  suppressHydrationWarning
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-1.5 text-[#6f0c07]/85 hover:text-[#580a06] -ml-1.5 cursor-pointer"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center bg-[#fafafa] text-[#6f0c07] p-2 rounded-full border border-[#ece7e6] hover:bg-[#6f0c07]/10 hover:border-[#6f0c07]/40 transition flex-shrink-0 cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Center: Logo */}
              <div className="flex items-center justify-center h-10">
                <Link href="/" className="flex items-center">
                  <img
                    src="/logo.png"
                    alt="Wholesaler-PK"
                    className="h-9 sm:h-10 w-auto object-contain"
                  />
                </Link>
              </div>

              {/* Right: Cart */}
              <div className="flex items-center justify-end">
                <button
                  suppressHydrationWarning
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 text-[#6f0c07]/85 hover:text-[#580a06] cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {mounted && totalCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#6f0c07] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse shadow-xs font-display">
                        {totalCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Desktop Logo — left */}
            <div className="hidden lg:flex flex-shrink-0 relative h-14 w-36">
              <Link
                href="/"
                className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center z-10"
              >
                <img
                  src="/logo.png"
                  alt="Wholesaler-PK"
                  className="h-26 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Center Menu — Home, Shop, Categories, Reviews */}
            <div className="hidden lg:flex items-center justify-center">
              <HeaderMainNav />
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex flex-col items-end min-w-0">
              {/* Social Icons Row */}
              <div className="flex items-center gap-2 mb-2">
                <a
                  href="https://www.facebook.com/share/1JfmNRYKKp/"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="w-7 h-7 rounded-full bg-[#fafafa] text-[#6f0c07] flex items-center justify-center border border-[#ece7e6] hover:bg-[#6f0c07] hover:text-white hover:border-[#6f0c07] transition"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.instagram.com/waadajewels?stkn=ZDlsMDdoenQ4Z3Rh"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="w-7 h-7 rounded-full bg-[#fafafa] text-[#6f0c07] flex items-center justify-center border border-[#ece7e6] hover:bg-[#6f0c07] hover:text-white hover:border-[#6f0c07] transition"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  title="TikTok"
                  className="w-7 h-7 rounded-full bg-[#fafafa] text-[#6f0c07] flex items-center justify-center border border-[#ece7e6] hover:bg-[#6f0c07] hover:text-white hover:border-[#6f0c07] transition"
                >
                  <TiktokIcon />
                </a>
              </div>

              {/* Actions Row */}
              <div className="flex items-center space-x-4 text-sm">

                {/* Desktop Search */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center bg-[#fafafa] text-[#1a1a1a] px-4 py-2 rounded-xl text-xs font-medium border border-[#ece7e6] hover:bg-[#6f0c07]/10 hover:text-[#6f0c07] hover:border-[#6f0c07]/40 transition cursor-pointer"
                >
                  <Search className="w-4 h-4 mr-2 text-[#6f0c07]" />
                  <span>Search products...</span>
                </button>

                {/* Shopping Cart Button */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center space-x-2 bg-[#fafafa] text-[#6f0c07] font-semibold text-xs px-3.5 py-2 rounded-xl border border-[#ece7e6] hover:bg-[#6f0c07]/10 hover:border-[#6f0c07]/40 transition cursor-pointer"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4 text-[#6f0c07]" />
                    {mounted && totalCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#6f0c07] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse font-display">
                        {totalCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden xl:inline uppercase tracking-wider font-display text-[11px]">Cart</span>
                </button>

                {/* Account / Sign In Button */}
                {mounted && (
                  user ? (
                    <div className="flex items-center gap-2 bg-[#fafafa] text-[#6f0c07] px-3 py-1.5 rounded-xl border border-[#ece7e6]">
                      <span className="text-xs font-semibold max-w-[90px] truncate text-[#6f0c07]">
                        {profile?.displayName || user.email?.split('@')[0] || 'User'}
                      </span>
                      <button
                        onClick={() => signOut()}
                        className="text-gray-400 hover:text-[#6f0c07] p-1 transition cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openAuthModal('login')}
                      className="flex items-center space-x-2 bg-[#6f0c07] hover:bg-[#580a06] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-white" />
                      <span className="hidden xl:inline uppercase tracking-wider font-display text-[11px]">Sign In</span>
                    </button>
                  )
                )}

              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Off-Canvas Menu (slides in from the left) */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}