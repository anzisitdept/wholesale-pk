'use client';

import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import HeroSlider from '@/components/home/HeroSlider';
import ProductCarousel from '@/components/home/ProductCarousel';
import CustomerReviews from '@/components/reviews/ReviewCarousel';
import { useStoreData } from '@/context/StoreDataContext';

export default function Home() {
  const { storeContent } = useStoreData();

  return (
    <>
      {/* 1. TOP BAR */}
      <TopBar />
      <Header />

      <main className="flex-1 w-full overflow-hidden">
        {/* 2. HERO SECTION */}
        <HeroSlider />

        {/* 3. Best Sellers */}
        <ProductCarousel 
          title={storeContent.bestSellers?.title || "Best Sellers"} 
          categoryFilter="best-selling"
          productIds={storeContent.bestSellers?.productIds}
        />

        {/* Customer Reviews */}
        <CustomerReviews />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
