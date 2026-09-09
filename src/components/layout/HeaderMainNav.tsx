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
  const [categoriesOpen, setCategoriesOpen] = useState(false);
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
    setCategoriesOpen(true);
  };

  const handleHideDropDown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 150);
  };

  const handleItemClick = () => {
    setCategoriesOpen(false);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className="flex items-center gap-5 xl:gap-8 select-none">
      {/* Home */}
      <Link
        href="/"
        onClick={handleItemClick}
        className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
      >
        Home
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
      </Link>

      {/* Shop — simple link to All Products */}
      <Link
        href="/collections/all-products"
        onClick={handleItemClick}
        className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
      >
        Shop
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
      </Link>

      {/* Categories with Mega Dropdown */}
      <div
        className="relative"
        onMouseEnter={handleShowDropDown}
        onMouseLeave={handleHideDropDown}
      >
        <Link
          href="/collections/all-products"
          onClick={handleItemClick}
          className={`flex items-center gap-1.5 font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap ${
            categoriesOpen ? 'text-white' : 'text-white/90 hover:text-white'
          }`}
        >
          <span>Categories</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              categoriesOpen ? 'rotate-180 text-white' : 'rotate-0 opacity-70 group-hover:opacity-100'
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
              categoriesOpen ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </Link>

        {/* Categories Mega Dropdown */}
        {categoriesOpen && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in duration-150"
            onMouseEnter={handleShowDropDown}
            onMouseLeave={handleHideDropDown}
          >
            <div
              className="w-[640px] max-w-[85vw] bg-[#000000] border border-white/20 rounded-xl p-4 shadow-2xl"
              style={{
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.85), 0 0 1px 1px rgba(255,255,255,0.1)',
              }}
            >
              {/* Quick Links */}
              <div className="flex items-center flex-wrap gap-x-6 gap-y-1 pb-3 mb-3 border-b border-white/10">
                <span className="text-[11px] font-semibold tracking-wider text-white/50 uppercase flex-shrink-0">
                  Categories
                </span>
                <Link
                  href="/collections/all-products"
                  onClick={handleItemClick}
                  className="text-white font-bold text-[11px] uppercase tracking-wider relative group py-0.5 transition-colors whitespace-nowrap block"
                >
                  All Products
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/collections/new-arrivals"
                  onClick={handleItemClick}
                  className="text-white font-bold text-[11px] uppercase tracking-wider relative group py-0.5 transition-colors whitespace-nowrap block"
                >
                  New Arrivals
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/collections/best-selling"
                  onClick={handleItemClick}
                  className="text-white font-bold text-[11px] uppercase tracking-wider relative group py-0.5 transition-colors whitespace-nowrap block"
                >
                  Best Selling
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 max-h-[380px] overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const subs = cat.subcategories || [];
                  return (
                    <div key={cat.id || cat.slug} className="min-w-0">
                      <Link
                        href={`/collections/${cat.slug}`}
                        onClick={handleItemClick}
                        className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-white group/cat py-1 transition-colors"
                      >
                        <span className="truncate">{cat.name.replace(/\s*\([^)]*\)/g, '')}</span>
                        <ChevronDown size={12} className="rotate-[-90deg] opacity-60 group-hover/cat:opacity-100" />
                      </Link>
                      <ul className="mt-1 space-y-1 border-l border-white/10 pl-2.5">
                        {subs.slice(0, 6).map((sub) => (
                          <li key={sub.id || sub.slug}>
                            <Link
                              href={`/collections/${cat.slug}/${sub.slug}`}
                              onClick={handleItemClick}
                              className="block text-[11px] text-white/70 hover:text-white py-0.5 transition-colors truncate"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                        {subs.length > 6 && (
                          <li>
                            <Link
                              href={`/collections/${cat.slug}`}
                              onClick={handleItemClick}
                              className="block text-[11px] font-semibold text-white/80 hover:text-white py-0.5 transition-colors"
                            >
                              View all {cat.name.replace(/\s*\([^)]*\)/g, '')} &rarr;
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reviews */}
      <Link
        href="/#reviews"
        onClick={handleItemClick}
        className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
      >
        Reviews
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
      </Link>
    </nav>
  );
}