'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import HeaderMainNav from './HeaderMainNav';
import MobileNavDrawer from './MobileNavDrawer';

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
      <header className={`bg-[#141415]/95 backdrop-blur-md border-b border-[#23262f] sticky top-0 z-40 shadow-xs transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
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
                  className="p-1.5 text-gray-200 hover:text-white -ml-1.5 cursor-pointer"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center bg-[#20232a] text-gray-300 hover:text-white p-2 rounded-full border border-white/5 hover:bg-[#282c35] transition flex-shrink-0 cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Center: Logo */}
              <div className="flex items-center justify-center h-10">
                <Link href="/" className="flex items-center">
                  <img
                    src="/Wholesaler Logo 2.png"
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
                  className="p-2 text-gray-200 hover:text-white cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {mounted && totalCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#007aff] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse shadow-xs font-display">
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
                  src="/Wholesaler Logo 2.png"
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
              {/* Customer Service Text */}
              <div className="text-[11px] text-gray-300 font-medium text-right mb-2 font-body">
                Customer Service<br />
                <span className="font-semibold text-white">WhatsApp & Cell 0310-0005480</span>
              </div>

              {/* Actions Row */}
              <div className="flex items-center space-x-4 text-sm">

                {/* Desktop Search */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center bg-[#20232a] text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-medium border border-white/5 hover:bg-[#282c35] transition cursor-pointer"
                >
                  <Search className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Search products...</span>
                </button>

                {/* Shopping Cart Button */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center space-x-2 bg-[#20232a] text-white font-semibold text-xs px-3.5 py-2 rounded-xl border border-white/5 hover:bg-[#282c35] transition cursor-pointer"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4 text-white" />
                    {mounted && totalCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#007aff] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse font-display">
                        {totalCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden xl:inline uppercase tracking-wider font-display text-[11px]">Cart</span>
                </button>

                {/* Account / Sign In Button */}
                {mounted && (
                  user ? (
                    <div className="flex items-center gap-2 bg-[#20232a] text-white px-3 py-1.5 rounded-xl border border-white/5">
                      <span className="text-xs font-semibold max-w-[90px] truncate text-gray-200">
                        {profile?.displayName || user.email?.split('@')[0] || 'User'}
                      </span>
                      <button
                        onClick={() => signOut()}
                        className="text-gray-400 hover:text-red-400 p-1 transition cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openAuthModal('login')}
                      className="flex items-center space-x-2 bg-[#007aff] hover:bg-[#0066cc] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
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