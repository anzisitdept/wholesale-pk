'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { ShoppingBag, Star, Clock } from 'lucide-react';
import { Product } from '@/types';
import { useStoreData } from '@/context/StoreDataContext';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice, getProductEffectiveOriginalPrice, getProductDisplayWeight } from '@/lib/productPrice';
import SectionHeading from '@/components/ui/SectionHeading';

interface ProductCarouselProps {
  title?: string;
  categoryFilter?: string;
  productIds?: string[];
  viewAllLink?: string;
}

export default function ProductCarousel({ 
  title = "DISCOVER OUR PREMIUM COLLECTION", 
  categoryFilter,
  productIds,
  viewAllLink = "/collections/all-products"
}: ProductCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps'
  });

  const { addToCart } = useCart();
  const { products } = useStoreData();

  let filteredProducts: Product[] = [];

  // 1. If explicit productIds are provided from Firestore store_content curated section
  if (productIds && productIds.length > 0) {
    filteredProducts = productIds
      .map(id => products.find(p => p.id === id || p.slug === id))
      .filter((p): p is Product => Boolean(p));
  }

  // 2. Filter by categoryFilter if explicit productIds were not provided
  if (filteredProducts.length === 0) {
    if (categoryFilter === 'best-selling') {
      filteredProducts = products.filter(p => p.isBestSeller);
    } else if (categoryFilter === 'new-arrivals') {
      filteredProducts = products.filter(p => p.isNew);
    } else if (categoryFilter === 'bundles') {
      filteredProducts = products.filter(p => 
        p.category === 'bundles' || 
        p.slug.toLowerCase().includes('bundle') || 
        p.name.toLowerCase().includes('bundle')
      );
    } else if (categoryFilter === 'special') {
      filteredProducts = products.filter(p => 
        Boolean(p.discountBadge) || 
        p.category === 'special'
      );
    } else if (categoryFilter) {
      filteredProducts = products.filter(p => p.category?.toLowerCase() === categoryFilter.toLowerCase());
    } else {
      filteredProducts = products;
    }
  }

  // Only render products that actually have an image
  filteredProducts = filteredProducts.filter(p => {
    const img = (p.image && p.image.trim() !== '') || (p.images && p.images[0] && p.images[0].trim() !== '');
    return Boolean(img);
  });

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-[#141415] w-full overflow-hidden">
        <div className="container mx-auto px-3 md:px-4 lg:px-8 max-w-7xl">
          {/* Title Header */}
          <SectionHeading title={title} subtitle="Coming Soon" className="mb-6 md:mb-8" />

          {/* Coming Soon Card */}
          <div className="py-10 md:py-14 text-center bg-[#1a1c22] rounded-2xl border border-dashed border-[#2b2f3a] max-w-xl mx-auto px-6">
            <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-white">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-display text-sm md:text-base font-bold text-white mb-1.5 uppercase tracking-wider">
              Products Coming Soon
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed font-body">
              We are curating and stocking premium products for this section. Once added from the admin panel, they will appear here automatically!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-[#141415] w-full overflow-hidden">
      <div className="container mx-auto px-3 md:px-4 lg:px-8 max-w-7xl">
        
        {/* Title Header */}
        <SectionHeading 
          title={title} 
          viewAllLink={viewAllLink} 
          viewAllText="VIEW ALL PRODUCTS" 
          className="mb-6 md:mb-10" 
        />
        
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 md:gap-5">
            {filteredProducts.map(product => {
              const displayPrice = getProductEffectivePrice(product);
              const originalPrice = getProductEffectiveOriginalPrice(product, displayPrice);
              const displayWeight = getProductDisplayWeight(product);
              const hasDiscount = originalPrice > displayPrice;
              const primaryImage = product.image || (product.images && product.images[0]) || '';
              const hoverImage = product.hoverImage || primaryImage;

              return (
                <div key={product.id} className="flex-[0_0_72%] xs:flex-[0_0_55%] sm:flex-[0_0_46%] lg:flex-[0_0_23.5%] min-w-0">
                  <div className="bg-[#1a1c22] group border border-[#262932] rounded-2xl overflow-hidden hover:border-[#383d4a] hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative">
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-20 flex flex-col items-start gap-1">
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

                    {/* Image Container */}
                    <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-[#20232a] block">
                      {primaryImage ? (
                        <>
                          <img 
                            src={primaryImage} 
                            alt={product.name || 'Product Image'} 
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0 z-10" 
                          />
                          <img 
                            src={hoverImage} 
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

                    {/* Quick Add Overlay Button */}
                    <div className="p-2 md:p-3 bg-[#17191e] border-t border-[#232630]">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-[#007aff] hover:bg-[#0069d9] active:scale-[0.98] text-white font-extrabold text-[10px] md:text-xs uppercase tracking-wider py-2 md:py-2.5 rounded-xl flex items-center justify-center space-x-1.5 md:space-x-2 transition font-display shadow-xs cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
