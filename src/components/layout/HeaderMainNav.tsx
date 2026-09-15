'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useStoreData } from '@/context/StoreDataContext';

interface HeaderMainNavProps {
  onNavigate?: () => void;
}

export default function HeaderMainNav({ onNavigate }: HeaderMainNavProps) {
  const { categories } = useStoreData();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleShowDropDown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleHideDropDown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onNavigate) onNavigate();
  };

  // Desktop Collections dropdown shows the same set as the mobile drawer:
  // Necklaces, Rings, Bracelets, FireLighters, Watches
  const navCategories = categories.filter(c =>
    ['necklaces', 'rings', 'bracelets', 'firefighters', 'firelighters', 'firelighter', 'watches', 'watch'].includes(c.id || c.slug)
  );

  return (
    <nav className="flex items-center gap-5 xl:gap-8 select-none">
      {/* Home */}
      <Link
        href="/"
        onClick={handleItemClick}
        className="text-[#6f0c07] font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
      >
        Home
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6f0c07] transition-all duration-300 group-hover:w-full" />
      </Link>

      {/* Shop */}
      <Link
        href="/collections/all-products"
        onClick={handleItemClick}
        className="text-[#6f0c07] font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
      >
        Shop
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6f0c07] transition-all duration-300 group-hover:w-full" />
      </Link>

      {/* Collections — Mega Dropdown */}
      <div
        className="relative"
        onMouseEnter={handleShowDropDown}
        onMouseLeave={handleHideDropDown}
      >
        <Link
          href="/collections/all-products"
          onClick={handleItemClick}
          className={`flex items-center gap-1.5 font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap ${
            isOpen ? 'text-[#580a06]' : 'text-[#6f0c07] hover:text-[#580a06]'
          }`}
        >
          <span>Collections</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#6f0c07]' : 'rotate-0 opacity-70 group-hover:opacity-100'
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 bg-[#6f0c07] transition-all duration-300 ${
              isOpen ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </Link>

        {isOpen && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in duration-150"
            onMouseEnter={handleShowDropDown}
            onMouseLeave={handleHideDropDown}
          >
            <div
              className="bg-[#580a06] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
              style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35), 0 0 1px 1px rgba(255,255,255,0.08)' }}
            >
              <div className="py-2 px-2 w-[240px]">
                <Link
                  href="/collections/all-products"
                  onClick={handleItemClick}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg text-[12px] font-semibold tracking-wide transition-colors text-white/60 hover:text-white hover:bg-white/[0.06]"
                >
                  <span>All Products</span>
                </Link>
                {navCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.slug === 'custom-design' ? '/pages/contact-us' : `/collections/${cat.slug}`}
                    onClick={handleItemClick}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg text-[12px] font-semibold tracking-wide transition-colors text-white/60 hover:text-white hover:bg-white/[0.06]"
                  >
                    <span>{cat.name.replace(/\s*\([^)]*\)/g, '')}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}