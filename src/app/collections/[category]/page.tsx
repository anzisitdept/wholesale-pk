'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal, 
  X, 
  Clock, 
  ShoppingBag, 
  Star, 
  Heart
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ReviewsWidget from '@/components/layout/ReviewsWidget';

import { Product } from '@/types';
import { useStoreData } from '@/context/StoreDataContext';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice, getProductEffectiveOriginalPrice, getProductDisplayWeight } from '@/lib/productPrice';

/* ─── Sidebar Section Wrapper ────────────────────────── */
function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#262932] pb-4 mb-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer py-1 text-left group"
      >
        <span className="text-xs font-bold tracking-wider text-gray-200 uppercase font-display group-hover:text-white transition-colors">
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-gray-400 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition-colors" />
        )}
      </button>
      {open && <div className="pt-2">{children}</div>}
    </div>
  );
}

/* ─── Product Card ───────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const primaryImg = (product.image && product.image.trim() !== '') 
    ? product.image 
    : ((product.images && product.images[0] && product.images[0].trim() !== '') ? product.images[0] : '');
  const hoverImg = (product.hoverImage && product.hoverImage.trim() !== '') ? product.hoverImage : primaryImg;

  const displayPrice = getProductEffectivePrice(product);
  const originalPrice = getProductEffectiveOriginalPrice(product, displayPrice);
  const displayWeight = getProductDisplayWeight(product);
  const hasDiscount = originalPrice > displayPrice;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-[#1a1c22] group border border-[#262932] rounded-2xl overflow-hidden hover:border-[#383d4a] hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 flex flex-col justify-between relative h-full"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-20 flex flex-col items-start gap-1 pointer-events-none">
        {product.discountBadge && (
          <div className="bg-[#ff5722] text-white text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs font-display tracking-tight">
            {product.discountBadge}
          </div>
        )}
        {product.isBestSeller && (
          <div className="bg-[#ff9800] text-white text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs font-display tracking-tight">
            Best Selling
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label="Toggle wishlist"
        className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
          isWishlisted
            ? 'bg-[#ff5722] text-white shadow-md'
            : 'bg-black/40 text-gray-300 hover:text-white hover:bg-black/60'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-white' : ''}`} />
      </button>

      {/* Image Container with crossfade */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-[#20232a] block">
        {primaryImg ? (
          <>
            <img
              src={primaryImg}
              alt={product.name || 'Product Image'}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0 z-10"
            />
            <img
              src={hoverImg}
              alt={`${product.name || 'Product'} Alternate`}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-0"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}
      </Link>

      {/* Quick Add Button */}
      <div className="p-2 md:p-2.5 bg-[#17191e] border-t border-[#232630]">
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="w-full bg-[#007aff] hover:bg-[#0069d9] active:scale-[0.98] text-white font-extrabold text-[10px] md:text-xs uppercase tracking-wider py-2 md:py-2.5 rounded-xl flex items-center justify-center space-x-1.5 md:space-x-2 transition font-display shadow-xs cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>QUICK ADD</span>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3 md:p-4 text-center flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="text-[11px] md:text-xs font-bold text-gray-100 hover:text-[#007aff] transition-colors leading-relaxed line-clamp-2 block mb-1 font-body"
          >
            {product.name}
          </Link>
          {product.urduName && (
            <p className="text-[10px] md:text-[11px] text-gray-400 font-medium mb-2">{product.urduName}</p>
          )}
        </div>

        <div>
          <div className="flex justify-center items-center space-x-1 text-yellow-400 text-[10px] md:text-xs mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-400" />
            ))}
            <span className="text-[9px] md:text-[10px] text-gray-400 ml-1">({product.reviewsCount || 100})</span>
          </div>

          <div className="flex justify-center items-center space-x-1.5 text-[10px] md:text-xs flex-wrap">
            {hasDiscount && (
              <span className="text-gray-400 line-through">Rs. {originalPrice.toLocaleString()}</span>
            )}
            {product.weights && product.weights.length > 1 && (
              <span className="text-gray-400 text-[10px] md:text-[11px] font-medium">{displayWeight}:</span>
            )}
            <span className="text-white font-black text-xs md:text-sm font-display tracking-tight">
              Rs. {displayPrice.toLocaleString()}
            </span>
          </div>
        </div>
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
    : (categorySlug === 'best-selling' || categorySlug === 'best-sellers')
    ? 'BEST SELLING'
    : (categoryData ? categoryData.name.split('(')[0].trim().toUpperCase() : categorySlug.replace(/-/g, ' ').toUpperCase());

  // Dynamically filter products by category
  let categoryProducts: Product[] = [];
  if (categorySlug === 'all' || categorySlug === 'all-products') {
    categoryProducts = products.filter(p => p.showInAllProducts !== false);
  } else if (categorySlug === 'best-selling' || categorySlug === 'best-sellers') {
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
    <aside className="lg:border-r lg:border-[#262932] lg:pr-5">
      <SideSection title="Categories">
        <div className="flex flex-col gap-1">
          {categories.map(cat => {
            const isActive = cat.slug === categorySlug;
            return (
              <Link
                key={cat.id}
                href={`/collections/${cat.slug}`}
                onClick={() => setShowFilter(false)}
                className={`text-xs px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#007aff]/15 text-[#007aff] font-bold border-l-2 border-[#007aff]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{cat.name.split('(')[0].trim()}</span>
              </Link>
            );
          })}
        </div>
      </SideSection>

      <SideSection title="Availability">
        <div className="flex flex-col gap-2 text-xs text-gray-300">
          <label className="flex items-center gap-2.5 cursor-pointer hover:text-white transition-colors select-none">
            <input
              type="checkbox"
              checked={inStockFilter}
              onChange={e => setInStockFilter(e.target.checked)}
              className="w-4 h-4 rounded border-[#262932] bg-[#1a1c22] accent-[#007aff] cursor-pointer"
            />
            <span>In Stock ({inStockCount})</span>
          </label>
          <label className={`flex items-center gap-2.5 cursor-pointer hover:text-white transition-colors select-none ${outOfStockCount === 0 ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              checked={outOfStockFilter}
              onChange={e => setOutOfStockFilter(e.target.checked)}
              className="w-4 h-4 rounded border-[#262932] bg-[#1a1c22] accent-[#007aff] cursor-pointer"
            />
            <span>Out Of Stock ({outOfStockCount})</span>
          </label>
        </div>
      </SideSection>

      <SideSection title="Bestselling">
        <div className="flex flex-col gap-2.5">
          {bestSellers.map(p => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="flex gap-2.5 items-center p-1.5 rounded-xl hover:bg-white/[0.04] transition group"
            >
              <div className="relative w-14 h-14 rounded-lg bg-[#20232a] border border-[#262932] overflow-hidden flex-shrink-0">
                {p.discountBadge && (
                  <div className="absolute top-0 left-0 bg-[#ff5722] text-white text-[8px] font-black px-1 py-0.5 z-10 rounded-br">
                    {p.discountBadge}
                  </div>
                )}
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-300 group-hover:text-white leading-snug line-clamp-2 mb-1 transition-colors">
                  {p.name.split('(')[0].trim()}
                </p>
                <p className="text-xs">
                  {p.originalPrice && p.originalPrice > p.price ? (
                    <span className="line-through text-gray-500 mr-1.5 text-[11px]">
                      Rs.{p.originalPrice.toLocaleString()}
                    </span>
                  ) : null}
                  <span className="text-white font-bold font-display">
                    Rs.{p.price.toLocaleString()}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SideSection>
    </aside>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-2">
      {/* Breadcrumb Navigation */}
      <nav className="py-4 text-xs text-gray-400 flex items-center flex-wrap gap-2">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          Home
        </Link>
        <span className="text-gray-600">/</span>
        <Link href={`/collections/${categorySlug}`} className="text-gray-200 hover:text-white transition-colors">
          {categoryTitle}
        </Link>
        {activeSub && (
          <>
            <span className="text-gray-600">/</span>
            <span className="text-[#007aff] font-semibold">
              {categoryData?.subcategories?.find(s => s.slug === activeSub || s.id === activeSub)?.name || activeSub.replace(/-/g, ' ')}
            </span>
          </>
        )}
      </nav>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8 pt-2 pb-16">
        
        {/* Left Sidebar - hidden on mobile, shown in drawer */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Filter Drawer */}
        {showFilter && (
          <div className="fixed inset-0 z-[105] lg:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setShowFilter(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#141415] text-[#f4f4f5] border-r border-[#262932] shadow-2xl overflow-y-auto p-5 animate-slideUp">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#262932]">
                <h3 className="font-display font-bold text-base text-white uppercase tracking-wide">Filters</h3>
                <button 
                  onClick={() => setShowFilter(false)} 
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer" 
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Right Content */}
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight [text-shadow:0_0_20px_rgba(255,255,255,0.15)]">
              {categoryTitle}
            </h1>
            <span className="text-xs text-gray-400 font-medium">
              Showing {displayed.length} of {filtered.length} products
            </span>
          </div>

          {/* Sub-Category Horizontal Pill Filters */}
          {categoryData?.subcategories && categoryData.subcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveSub(null)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  !activeSub
                    ? 'bg-[#007aff] text-white shadow-md shadow-[#007aff]/20'
                    : 'bg-[#1a1c22] text-gray-300 hover:text-white border border-[#262932] hover:border-gray-500'
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
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border flex-shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#007aff] text-white border-[#007aff] shadow-md shadow-[#007aff]/20'
                        : 'bg-[#1a1c22] text-gray-300 border-[#262932] hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {sub.image && (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    )}
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Control Bar */}
          <div className="flex items-center gap-3 py-3 border-y border-[#262932] mb-6 flex-wrap">

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilter(true)}
              className="lg:hidden flex items-center gap-2 bg-[#1a1c22] text-gray-200 border border-[#262932] hover:bg-[#20232a] rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#007aff]" />
              <span>Filters</span>
            </button>

            <div className="flex-1" />

            {/* Items Per Page */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Items
              </span>
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                className="bg-[#1a1c22] text-gray-200 border border-[#262932] hover:border-[#383d4a] focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer transition outline-none"
              >
                <option value={20} className="bg-[#1a1c22] text-white">20</option>
                <option value={40} className="bg-[#1a1c22] text-white">40</option>
                <option value={60} className="bg-[#1a1c22] text-white">60</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Sort by
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#1a1c22] text-gray-200 border border-[#262932] hover:border-[#383d4a] focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer transition outline-none"
              >
                <option value="featured" className="bg-[#1a1c22] text-white">Featured</option>
                <option value="best-selling" className="bg-[#1a1c22] text-white">Best Selling</option>
                <option value="title" className="bg-[#1a1c22] text-white">Alphabetically, A-Z</option>
                <option value="price-low" className="bg-[#1a1c22] text-white">Price, low to high</option>
                <option value="price-high" className="bg-[#1a1c22] text-white">Price, high to low</option>
              </select>
            </div>

          </div>

          {/* Active Filter Chips */}
          {(inStockFilter || outOfStockFilter || activeSub) && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-xs text-gray-400">Filtered by:</span>
              {activeSub && (
                <span className="inline-flex items-center gap-1.5 bg-[#20232a] text-xs px-3 py-1 rounded-full text-gray-200 border border-[#262932]">
                  Sub: {activeSub}
                  <button onClick={() => setActiveSub(null)} className="hover:text-white transition cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {inStockFilter && (
                <span className="inline-flex items-center gap-1.5 bg-[#20232a] text-xs px-3 py-1 rounded-full text-gray-200 border border-[#262932]">
                  In Stock
                  <button onClick={() => setInStockFilter(false)} className="hover:text-white transition cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {outOfStockFilter && (
                <span className="inline-flex items-center gap-1.5 bg-[#20232a] text-xs px-3 py-1 rounded-full text-gray-200 border border-[#262932]">
                  Out Of Stock
                  <button onClick={() => setOutOfStockFilter(false)} className="hover:text-white transition cursor-pointer">
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
                className="text-xs text-[#ff5722] hover:underline font-bold ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid or Coming Soon State */}
          {filtered.length === 0 ? (
            <div className="py-16 md:py-24 text-center bg-[#1a1c22] rounded-2xl border border-dashed border-[#2b2f3a] px-6 my-4">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2 uppercase tracking-wider">
                Products Coming Soon
              </h3>
              <p className="text-xs md:text-sm text-gray-400 max-w-md mx-auto leading-relaxed mb-6 font-body">
                We are stocking fresh products for {categoryTitle.toLowerCase()}. As soon as products are added from the admin panel, they will appear here automatically!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#007aff] hover:bg-[#0069d9] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition font-display"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4.5">
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
      <ReviewsWidget />
      <Suspense fallback={<div className="py-24 text-center text-gray-400 font-medium">Loading Category…</div>}>
        <CategoryInner forcedCategory={forcedCategory} forcedSubCategory={forcedSubCategory} />
      </Suspense>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
