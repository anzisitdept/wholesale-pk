'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ReviewsWidget from '@/components/layout/ReviewsWidget';
import { useCart } from '@/context/CartContext';
import { useStoreData } from '@/context/StoreDataContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, openQuickView } = useCart();
  const { products } = useStoreData();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <>
      <TopBar />
      <Header />
      <ReviewsWidget />

      <section className="bg-[#f5f5f5] py-10 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#000000] uppercase tracking-wide">
            My Wishlist ({wishlistProducts.length})
          </h1>
          <p className="text-xs md:text-sm text-gray-600 max-w-xl mx-auto mt-2">
            Your saved favorite products from Wholesaler-PK.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 lg:px-8 max-w-7xl py-12 min-h-[50vh]">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <Heart className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="text-gray-600 font-medium text-sm">Your wishlist is currently empty.</p>
            <Link
              href="/collections/all-products"
              className="inline-block bg-[#000000] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#333333] transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-gray-50 flex items-center justify-center">
                  {product.image && product.image.trim() !== '' ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-300 text-xs font-medium">No Image</span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-900 hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <button
                      type="button"
                      onClick={() => openQuickView(product)}
                      className="font-bold text-xs text-gray-900 hover:text-[#000000] line-clamp-2 block w-full cursor-pointer"
                    >
                      {product.name}
                    </button>
                    <p className="text-[11px] text-gray-400 mt-1">{product.urduName}</p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <span className="text-[#000000] font-extrabold text-sm block">
                      Rs. {product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-[#000000] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center space-x-2 transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>ADD TO CART</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
