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
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (categories.length > 0 && !categories.some(c => c.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

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

  const activeCat = categories.find(c => c.id === activeCategory) || categories[0];

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

      {/* Shop */}
      <Link
        href="/collections/all-products"
        onClick={handleItemClick}
        className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
      >
        Shop
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
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
            isOpen ? 'text-white' : 'text-white/90 hover:text-white'
          }`}
        >
          <span>Collections</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : 'rotate-0 opacity-70 group-hover:opacity-100'
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
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
              className="flex bg-[#0a0a0a] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
              style={{ width: 560, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 1px 1px rgba(255,255,255,0.08)' }}
            >
              {/* Left Sidebar — Categories */}
              <div className="w-[200px] flex-shrink-0 border-r border-white/10 py-2 bg-[#0f0f0f]">
                <Link
                  href="/collections/all-products"
                  onClick={handleItemClick}
                  className={`flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold tracking-wide transition-colors ${
                    activeCategory === '__all' ? 'text-white bg-white/[0.06]' : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`}
                  onMouseEnter={() => setActiveCategory('__all')}
                >
                  <span>All Products</span>
                  <ChevronDown size={12} className="rotate-[-90deg] opacity-50" />
                </Link>
                {categories.map((cat) => {
                  const subs = cat.subcategories || [];
                  const needsDropdown = subs.length > 0;
                  return (
                    <div
                      key={cat.id}
                      onMouseEnter={() => setActiveCategory(needsDropdown ? cat.id : `__link_${cat.id}`)}
                      onClick={handleItemClick}
                    >
                      <Link
                        href={needsDropdown ? cat.slug : `/collections/${cat.slug}`}
                        className={`flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold tracking-wide transition-colors ${
                          activeCategory === cat.id || activeCategory === `__link_${cat.id}`
                            ? 'text-white bg-white/[0.06]'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <span>{cat.name.replace(/\s*\([^)]*\)/g, '')}</span>
                        {needsDropdown ? (
                          <ChevronDown size={12} className="rotate-[-90deg] opacity-50" />
                        ) : null}
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Right Panel — Subcategories */}
              {activeCat && activeCat.subcategories && activeCat.subcategories.length > 0 ? (
                <div className="flex-1 py-3 px-5 min-h-[200px]">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-3">
                    {activeCat.name.replace(/\s*\([^)]*\)/g, '')}
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <Link
                      href={`/collections/${activeCat.slug}`}
                      onClick={handleItemClick}
                      className="text-[12px] text-white/70 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                    >
                      All {activeCat.name.replace(/\s*\([^)]*\)/g, '')}
                    </Link>
                    {activeCat.subcategories.map((sub) => (
                      <Link
                        key={sub.id || sub.slug}
                        href={`/collections/${activeCat.slug}/${sub.slug}`}
                        onClick={handleItemClick}
                        className="text-[12px] text-white/70 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/collections/${activeCat.slug}`}
                    onClick={handleItemClick}
                    className="inline-block mt-4 text-[11px] font-bold text-white/50 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    View All {activeCat.name.replace(/\s*\([^)]*\)/g, '')} →
                  </Link>
                </div>
              ) : (
                <div className="flex-1 py-3 px-5 min-h-[200px] flex flex-col items-start justify-center">
                  <div className="text-[12px] text-white/70 mb-2">
                    {activeCategory === '__all'
                      ? 'Browse every product in our store.'
                      : `Explore our ${(activeCat?.name || '').replace(/\s*\([^)]*\)/g, '')} collection.`}
                  </div>
                  <Link
                    href={activeCategory === '__all' ? '/collections/all-products' : `/collections/${activeCat?.slug}`}
                    onClick={handleItemClick}
                    className="inline-block mt-2 text-[11px] font-bold text-white/50 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    {activeCategory === '__all' ? 'All Products →' : `View All ${(activeCat?.name || '').replace(/\s*\([^)]*\)/g, '')} →`}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}