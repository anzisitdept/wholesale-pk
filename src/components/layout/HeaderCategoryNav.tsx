'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Tag } from 'lucide-react';
import { useStoreData } from '@/context/StoreDataContext';
import { Category, SubCategory } from '@/types';

interface HeaderCategoryNavProps {
  onNavigate?: () => void;
}

export default function HeaderCategoryNav({ onNavigate }: HeaderCategoryNavProps) {
  const { categories } = useStoreData();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // 150ms buffer time so the user can easily transition mouse from trigger to dropdown menu
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleItemClick = () => {
    setActiveDropdown(null);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className="w-full relative select-none">
      {/* 
        Horizontal row container:
        - flex-nowrap ensures it NEVER breaks into multiple rows
        - Auto-adjusting gap via responsive clamp & flex-shrink
        - overflow-x-auto with hidden scrollbar ensures graceful overflow if many categories are added
      */}
      <div 
        className="flex items-center flex-nowrap justify-between w-full overflow-x-clip py-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          gap: 'clamp(8px, 1.6vw, 28px)',
        }}
      >
        {/* All Products Link */}
        <div className="flex-shrink-0">
          <Link
            href="/collections/all-products"
            onClick={handleItemClick}
            className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
          >
            All Products
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* New Arrivals Link */}
        <div className="flex-shrink-0">
          <Link
            href="/collections/new-arrivals"
            onClick={handleItemClick}
            className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
          >
            New Arrivals
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Dynamic Main Categories */}
        {categories.map((cat, index) => {
          const subs = cat.subcategories || [];
          const hasSubs = subs.length > 0;
          const isOpen = activeDropdown === cat.id;

          // Smart horizontal alignment so dropdown does not clip off left or right screen edges
          const dropdownAlign = index <= 1
            ? 'left-0'
            : index >= categories.length - 2
            ? 'right-0'
            : 'left-1/2 -translate-x-1/2';

          return (
            <div
              key={cat.id || cat.slug}
              className="relative flex-shrink-0"
              onMouseEnter={() => hasSubs && handleMouseEnter(cat.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Category Nav Link / Trigger */}
              <Link
                href={`/collections/${cat.slug}`}
                onClick={handleItemClick}
                className={`flex items-center gap-1 font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap ${
                  isOpen ? 'text-white' : 'text-white/90 hover:text-white'
                }`}
              >
                <span>{cat.name.replace(/\s*\([^)]*\)/g, '')}</span>
                {hasSubs && (
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 opacity-70 group-hover:opacity-100 ${
                      isOpen ? 'rotate-180 text-white' : 'rotate-0'
                    }`}
                  />
                )}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>

              {/* Visual Sub-Category Dropdown Menu */}
              {hasSubs && isOpen && (
                <div
                  className={`absolute top-full ${dropdownAlign} pt-2 z-50 animate-in fade-in duration-150`}
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="w-[300px] sm:w-[340px] bg-[#000000] border border-white/20 rounded-xl p-3 shadow-2xl"
                    style={{
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.85), 0 0 1px 1px rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Header showing Main Category name */}
                    <div className="px-2 pb-2 mb-2 border-b border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                        {cat.name.replace(/\s*\([^)]*\)/g, '')} Categories
                      </span>
                      {cat.urduName && (
                        <span className="text-[11px] text-white/40 font-urdu" dir="rtl">
                          {cat.urduName}
                        </span>
                      )}
                    </div>

                    {/* Sub-Category Items */}
                    <div className="flex flex-col gap-1 max-h-[340px] overflow-y-auto pr-1">
                      {subs.map((sub: SubCategory) => (
                        <Link
                          key={sub.id || sub.slug}
                          href={`/collections/${cat.slug}/${sub.slug}`}
                          onClick={handleItemClick}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group/sub text-decoration-none"
                        >
                          {/* 36x36px Thumbnail Image with Fallback */}
                          <div className="relative w-9 h-9 flex-shrink-0 rounded-md overflow-hidden bg-white/5 border border-white/10 group-hover/sub:border-white/30 transition-colors flex items-center justify-center">
                            {sub.image ? (
                              <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover transform group-hover/sub:scale-110 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <Tag className="w-4 h-4 text-white/40 group-hover/sub:text-white" />
                            )}
                          </div>

                          {/* Sub-Category Labels */}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-semibold text-white/90 group-hover/sub:text-white truncate">
                              {sub.name}
                            </span>
                            {sub.urduName && (
                              <span
                                className="text-[10px] text-white/50 group-hover/sub:text-white/70 truncate"
                                dir="rtl"
                                style={{ textAlign: 'left' }}
                              >
                                {sub.urduName}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* 'View All in Department' Link */}
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <Link
                        href={`/collections/${cat.slug}`}
                        onClick={handleItemClick}
                        className="text-center text-[11px] font-bold text-white/80 hover:text-white py-1 block transition-colors group/viewall"
                      >
                        View all {cat.name.replace(/\s*\([^)]*\)/g, '')}{' '}
                        <span className="inline-block transition-transform duration-200 group-hover/viewall:translate-x-1">
                          &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Best Selling Link */}
        <div className="flex-shrink-0">
          <Link
            href="/collections/best-selling-pickles"
            onClick={handleItemClick}
            className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider relative group py-1 transition-colors whitespace-nowrap block"
          >
            Best Selling
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
