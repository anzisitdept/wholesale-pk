'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, SlidersHorizontal, X, Clock, Sparkles } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ReviewsWidget from '@/components/layout/ReviewsWidget';

import { Product } from '@/types';
import { useStoreData } from '@/context/StoreDataContext';
import { useCart } from '@/hooks/useCart';

/* ─── Sidebar Wrapper ────────────────────────── */
function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '14px', marginBottom: '14px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px 0' }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#111', textTransform: 'uppercase' }}>{title}</span>
        {open ? <ChevronUp size={14} color="#555" /> : <ChevronDown size={14} color="#555" />}
      </button>
      {open && children}
    </div>
  );
}

import { getProductEffectivePrice, getProductEffectiveOriginalPrice, getProductDisplayWeight } from '@/lib/productPrice';

/* ─── Product Card ───────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const primaryImg = (product.image && product.image.trim() !== '') 
    ? product.image 
    : ((product.images && product.images[0] && product.images[0].trim() !== '') ? product.images[0] : '');
  const hoverImg = (product.hoverImage && product.hoverImage.trim() !== '') ? product.hoverImage : primaryImg;
  const img = hovered && hoverImg ? hoverImg : primaryImg;

  const displayPrice = getProductEffectivePrice(product);
  const originalPrice = getProductEffectiveOriginalPrice(product, displayPrice);
  const displayWeight = getProductDisplayWeight(product);
  const hasDiscount = originalPrice > displayPrice;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: '12px', textAlign: 'center', background: '#fff', transition: 'all 0.2s ease', position: 'relative' }}
    >
      <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', marginBottom: '12px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {img ? (
          <img
            src={img}
            alt={product.name || 'Product'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
          />
        ) : (
          <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500 }}>
            No Image
          </div>
        )}

        <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 2 }}>
          {product.discountBadge && (
            <span style={{ background: '#000000', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', lineHeight: 1.4 }}>
              {product.discountBadge}
            </span>
          )}
          {product.isBestSeller && (
            <span style={{ background: '#000000', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', lineHeight: 1.4 }}>
              Best Selling
            </span>
          )}
        </div>
      </div>

      <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
        <h3 style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 600, lineHeight: 1.3, marginBottom: '6px' }}>
          {product.name}
        </h3>
      </Link>

      <div style={{ fontSize: '12px', color: '#777', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
        {hasDiscount && (
          <span style={{ textDecoration: 'line-through', color: '#999' }}>
            Rs.{originalPrice.toLocaleString()}.00
          </span>
        )}
        {product.weights && product.weights.length > 1 && (
          <span style={{ color: '#666', fontSize: '11px', fontWeight: 500 }}>
            {displayWeight}:
          </span>
        )}
        <span style={{ color: '#000000', fontWeight: 700 }}>
          Rs.{displayPrice.toLocaleString()}.00
        </span>
      </div>
    </div>
  );
}

export function CategoryInner({
  forcedCategory,
  forcedSubCategory
}: {
  forcedCategory?: string;
  forcedSubCategory?: string;
} = {}) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, categories } = useStoreData();

  const categorySlug = forcedCategory || (params?.category as string) || 'all-products';
  const paramSubCategory = forcedSubCategory || (params?.subcategory as string) || searchParams.get('sub') || null;
  const [activeSub, setActiveSub] = useState<string | null>(paramSubCategory);

  const categoryData = categories.find(c => c.slug === categorySlug || c.id === categorySlug);
  const categoryTitle = (categorySlug === 'all' || categorySlug === 'all-products')
    ? 'ALL PRODUCTS'
    : (categorySlug === 'best-selling' || categorySlug === 'best-sellers' || categorySlug === 'best-selling-pickles')
    ? 'BEST SELLING'
    : (categoryData ? categoryData.name.split('(')[0].trim().toUpperCase() : categorySlug.replace(/-/g, ' ').toUpperCase());

  // Dynamically filter products by category
  let categoryProducts: Product[] = [];
  if (categorySlug === 'all' || categorySlug === 'all-products') {
    categoryProducts = products.filter(p => p.showInAllProducts !== false);
  } else if (categorySlug === 'best-selling' || categorySlug === 'best-sellers' || categorySlug === 'best-selling-pickles') {
    categoryProducts = products.filter(p => p.isBestSeller);
  } else if (categorySlug === 'new-arrivals') {
    categoryProducts = products.filter(p => p.isNew);
  } else {
    categoryProducts = products.filter(p => p.category.toLowerCase() === categorySlug.toLowerCase());
  }

  // Filter by subcategory if selected
  if (activeSub) {
    const subQuery = activeSub.toLowerCase();
    categoryProducts = categoryProducts.filter(p =>
      (p.subCategory && p.subCategory.toLowerCase() === subQuery) ||
      (p.subCategoryName && p.subCategoryName.toLowerCase().includes(subQuery)) ||
      p.slug.toLowerCase().includes(subQuery) ||
      p.name.toLowerCase().includes(subQuery)
    );
  }

  const isAllProducts = categorySlug === 'all' || categorySlug === 'all-products';
  // Only show products with a real image - image-less placeholders are excluded.
  // Products once added/updated with images from the admin panel will appear.
  const hasImage = (p: Product) => Boolean(
    (p.image && p.image.trim() !== '') ||
    (p.images && p.images[0] && p.images[0].trim() !== '')
  );
  const displayProductsList = (isAllProducts
    ? categoryProducts
    : (categoryProducts.length > 0 ? categoryProducts : products.filter(p => p.category === categorySlug)))
    .filter(hasImage);

  const defaultSort = isAllProducts ? 'featured' : 'best-selling';
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || defaultSort);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showFilter, setShowFilter] = useState(false);
  const [inStockFilter, setInStockFilter] = useState(false);
  const [outOfStockFilter, setOutOfStockFilter] = useState(false);

  const inStockCount = displayProductsList.filter(p => p.inStock !== false).length;
  const outOfStockCount = displayProductsList.filter(p => p.inStock === false).length;

  let filtered = [...displayProductsList];
  if (inStockFilter && !outOfStockFilter) {
    filtered = filtered.filter(p => p.inStock !== false);
  } else if (!inStockFilter && outOfStockFilter) {
    filtered = filtered.filter(p => p.inStock === false);
  }

  if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === 'title') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'best-selling') filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));

  const displayed = filtered.slice(0, itemsPerPage);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 3);

  const Sidebar = () => (
    <aside className="lg:border-r lg:border-gray-100 lg:pr-5">
      <SideSection title="Categories">
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              onClick={() => setShowFilter(false)}
              style={{
                fontSize: '12px',
                color: cat.slug === categorySlug ? '#000000' : '#444',
                fontWeight: cat.slug === categorySlug ? 700 : 400,
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{cat.name.split('(')[0].trim()}</span>
            </Link>
          ))}
        </div>
      </SideSection>

      <SideSection title="Availability">
        <div className="flex flex-col gap-1.5 text-xs text-gray-600">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockFilter}
              onChange={e => setInStockFilter(e.target.checked)}
              className="accent-[#000000] cursor-pointer"
            />
            <span>In Stock ({inStockCount})</span>
          </label>
          <label className={`flex items-center gap-1.5 cursor-pointer ${outOfStockCount === 0 ? 'opacity-60' : ''}`}>
            <input
              type="checkbox"
              checked={outOfStockFilter}
              onChange={e => setOutOfStockFilter(e.target.checked)}
              className="accent-[#000000] cursor-pointer"
            />
            <span>Out Of Stock ({outOfStockCount})</span>
          </label>
        </div>
      </SideSection>

      <SideSection title="Bestselling">
        <div className="flex flex-col gap-3.5">
          {bestSellers.map(p => (
            <Link key={p.id} href={`/products/${p.slug}`} className="flex gap-2.5 items-center no-underline">
              <div className="relative w-14 h-14 flex-shrink-0 border border-gray-200 overflow-hidden">
                {p.discountBadge && (
                  <div className="absolute top-0 left-0 bg-[#000000] text-white text-[8px] font-bold px-1 py-px z-10">
                    {p.discountBadge}
                  </div>
                )}
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[11px] text-gray-800 leading-snug mb-1">{p.name.split('(')[0].trim()}</p>
                <p className="text-[11px]">
                  {p.originalPrice && p.originalPrice > p.price ? (
                    <span className="line-through text-gray-400 mr-1">Rs.{p.originalPrice.toLocaleString()}</span>
                  ) : null}
                  <span className="text-[#000000] font-bold">Rs.{p.price.toLocaleString()}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SideSection>
    </aside>
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6">
      {/* Breadcrumb Navigation */}
      <nav className="py-4 text-xs text-gray-500 flex items-center flex-wrap gap-1.5">
        <Link href="/" className="text-gray-500 hover:text-black no-underline">Home</Link>
        <span className="text-gray-400">{'>'}</span>
        <Link href={`/collections/${categorySlug}`} className="text-gray-700 hover:text-black no-underline">
          {categoryTitle}
        </Link>
        {activeSub && (
          <>
            <span className="text-gray-400">{'>'}</span>
            <span className="text-black font-semibold">
              {categoryData?.subcategories?.find(s => s.slug === activeSub || s.id === activeSub)?.name || activeSub.replace(/-/g, ' ')}
            </span>
          </>
        )}
      </nav>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8 pt-2.5 pb-14">
        
        {/* Left Sidebar - hidden on mobile, shown in drawer */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Filter Drawer */}
        {showFilter && (
          <div className="fixed inset-0 z-[105] lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilter(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto p-5 animate-slideUp">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-900 uppercase">Filters</h3>
                <button onClick={() => setShowFilter(false)} className="p-1 text-gray-500 hover:text-gray-900" aria-label="Close filters">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Right Content */}
        <div className="min-w-0">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {categoryTitle}
          </h1>

          {/* Sub-Category Horizontal Pill Filters */}
          {categoryData?.subcategories && categoryData.subcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                type="button"
                onClick={() => setActiveSub(null)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  !activeSub
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All {categoryData.name.replace(/\s*\([^)]*\)/g, '').trim()}
              </button>
              {categoryData.subcategories.map(sub => {
                const isActive = activeSub?.toLowerCase() === sub.slug.toLowerCase();
                return (
                  <button
                    key={sub.id || sub.slug}
                    type="button"
                    onClick={() => setActiveSub(isActive ? null : sub.slug)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0 ${
                      isActive
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {sub.image && (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Control Bar */}
          <div className="flex items-center gap-3 pb-3.5 border-b border-gray-200 mb-5 flex-wrap">

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilter(true)}
              className="lg:hidden flex items-center gap-1.5 border border-gray-300 rounded px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>

            <div className="flex-1" />

            {/* Items Per Page */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] font-semibold text-gray-500 uppercase">Items</span>
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1.5 text-xs bg-white cursor-pointer"
              >
                <option value={20}>20</option>
                <option value={40}>40</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] font-semibold text-gray-500 uppercase">Sort by</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-xs bg-white cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="title">Alphabetically, A-Z</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
              </select>
            </div>

          </div>

          {/* Active Filter Chips */}
          {(inStockFilter || outOfStockFilter || activeSub) && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-gray-500">Filtered by:</span>
              {activeSub && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-xs px-2.5 py-1 rounded-full text-gray-700">
                  Sub-Category: {activeSub}
                  <button onClick={() => setActiveSub(null)} className="hover:text-black">
                    <X size={12} />
                  </button>
                </span>
              )}
              {inStockFilter && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-xs px-2.5 py-1 rounded-full text-gray-700">
                  In Stock
                  <button onClick={() => setInStockFilter(false)} className="hover:text-black">
                    <X size={12} />
                  </button>
                </span>
              )}
              {outOfStockFilter && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-xs px-2.5 py-1 rounded-full text-gray-700">
                  Out Of Stock
                  <button onClick={() => setOutOfStockFilter(false)} className="hover:text-black">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setInStockFilter(false);
                  setOutOfStockFilter(false);
                  setActiveSub(null);
                }}
                className="text-xs text-red-600 hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid or Coming Soon State */}
          {filtered.length === 0 ? (
            <div className="py-16 md:py-24 text-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-300 px-6 my-4">
              <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4 text-black">
                <Clock className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Products Coming Soon
              </h3>
              <p className="text-xs md:text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
                We are stocking fresh products for {categoryTitle.toLowerCase()}. As soon as products are added from the admin panel, they will appear here automatically!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {displayed.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default function CategoryCollectionPage({
  forcedCategory,
  forcedSubCategory
}: {
  forcedCategory?: string;
  forcedSubCategory?: string;
} = {}) {
  return (
    <>
      <TopBar />
      <Header />
      <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading Category…</div>}>
        <CategoryInner forcedCategory={forcedCategory} forcedSubCategory={forcedSubCategory} />
      </Suspense>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
