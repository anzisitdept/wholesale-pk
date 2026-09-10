'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Clock } from 'lucide-react';
import { Product } from '@/types';
import { useStoreData } from '@/context/StoreDataContext';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCardClient from '@/app/collections/[category]/ProductCardClient';

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
            {filteredProducts.map(product => (
              <div key={product.id} className="flex-[0_0_85%] xs:flex-[0_0_70%] sm:flex-[0_0_50%] md:flex-[0_0_48%] lg:flex-[0_0_31.5%] min-w-0">
                <ProductCardClient product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}